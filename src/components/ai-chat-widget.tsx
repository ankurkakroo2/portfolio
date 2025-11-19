"use client";

import { useEffect } from "react";

/**
 * ElevenLabs Conversational AI Widget
 *
 * SETUP INSTRUCTIONS:
 * 1. Complete voice cloning in ElevenLabs (see ai_voice_chat_guide.md)
 * 2. Create your conversational AI agent
 * 3. Get your agent ID from ElevenLabs dashboard
 * 4. Replace 'YOUR_AGENT_ID_HERE' below with your actual agent ID
 * 5. Uncomment the component in layout.tsx
 *
 * The widget will appear as a floating button in the bottom-right corner
 */

export function AIChatWidget() {
    useEffect(() => {
        // Load ElevenLabs Conversational AI widget script
        const script = document.createElement("script");
        script.src = "https://elevenlabs.io/convai-widget/index.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup on unmount
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <>
            {/*
        Replace 'YOUR_AGENT_ID_HERE' with your actual ElevenLabs agent ID
        Example: agent-id="abc123def456"
      */}
            <elevenlabs-convai
                agent-id="YOUR_AGENT_ID_HERE"
            />

            {/* Optional: Custom styling for dark/light mode */}
            <style jsx global>{`
        elevenlabs-convai {
          --primary-color: #000;
          --background-color: #fff;
          --text-color: #000;
        }

        .dark elevenlabs-convai {
          --primary-color: #fff;
          --background-color: #000;
          --text-color: #fff;
        }
      `}</style>
        </>
    );
}
