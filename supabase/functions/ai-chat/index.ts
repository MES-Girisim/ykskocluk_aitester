import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  subject: string;
  user_message: string;
  image_url?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { subject, user_message, image_url }: RequestBody = await req.json();

    if (!subject || !user_message) {
      return new Response(
        JSON.stringify({ error: "subject and user_message are required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    let aiResponse = "";

    if (openaiApiKey) {
      const messages: Array<{
        role: string;
        content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
      }> = [
        {
          role: "system",
          content: `Sen bir ${subject} öğretmenisin. Öğrencilere yardımcı ol ve açıklayıcı cevaplar ver.`,
        },
      ];

      if (image_url) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: user_message },
            { type: "image_url", image_url: { url: image_url } },
          ],
        });
      } else {
        messages.push({
          role: "user",
          content: user_message,
        });
      }

      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: image_url ? "gpt-4o" : "gpt-4o-mini",
          messages: messages,
          max_tokens: 1000,
        }),
      });

      if (openaiResponse.ok) {
        const data = await openaiResponse.json();
        aiResponse = data.choices[0]?.message?.content || "Cevap alınamadı.";
      } else {
        aiResponse = "AI servisi şu anda kullanılamıyor.";
      }
    } else {
      aiResponse = "AI API anahtarı yapılandırılmamış. Lütfen OPENAI_API_KEY environment variable ekleyin.";
    }

    const { data: messageData, error: dbError } = await supabase
      .from("messages")
      .insert({
        subject,
        user_message,
        image_url: image_url || null,
        ai_response: aiResponse,
      }, { count: "exact" })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({ message: messageData, ai_response: aiResponse }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
