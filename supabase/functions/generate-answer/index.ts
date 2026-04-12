import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { questionId, title, description } = await req.json();
    if (!questionId || !title) {
      return new Response(JSON.stringify({ error: "Missing questionId or title" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Guard: check if AI answer already exists
    const { data: existing } = await supabase
      .from("answers")
      .select("id")
      .eq("question_id", questionId)
      .eq("type", "ai")
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ answer: existing, duplicate: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are Cognara AI, an expert knowledge assistant. Provide thorough, well-structured answers to questions. Use markdown formatting with headings (##), bullet points, bold text, and code blocks where appropriate. Structure your answer in 3 parts:
1. **Direct Answer** - Clear, concise response to the question
2. **Detailed Explanation** - In-depth analysis with examples
3. **Key Takeaways** - Bullet points summarizing the main insights

Be accurate, concise, and helpful. If the question is ambiguous, address the most likely interpretation and mention alternatives.`;

    const userPrompt = description
      ? `Question: ${title}\n\nAdditional context: ${description}`
      : `Question: ${title}`;

    let aiContent: string | null = null;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts && !aiContent) {
      attempts++;
      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
          }),
        });

        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (!response.ok) {
          console.error(`[generate-answer] AI attempt ${attempts} failed:`, response.status, await response.text());
          continue;
        }

        const data = await response.json();
        aiContent = data.choices?.[0]?.message?.content;
      } catch (e) {
        console.error(`[generate-answer] AI attempt ${attempts} error:`, e);
      }
    }

    if (!aiContent) {
      // Update question ai_status to failed
      await supabase.from("questions").update({ ai_status: "failed" }).eq("id", questionId);
      return new Response(
        JSON.stringify({ error: "AI answer unavailable. Community answers will appear below.", failed: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save AI answer to database
    const { data: answer, error: dbError } = await supabase
      .from("answers")
      .insert({ question_id: questionId, content: aiContent, type: "ai", votes: 0 })
      .select()
      .single();

    if (dbError) {
      console.error("[generate-answer] DB insert error:", dbError);
      await supabase.from("questions").update({ ai_status: "failed" }).eq("id", questionId);
      return new Response(JSON.stringify({ error: "Failed to save AI answer" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update question ai_status to completed
    await supabase.from("questions").update({ ai_status: "completed" }).eq("id", questionId);

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[generate-answer] error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
