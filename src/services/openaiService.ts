
import { toast } from "sonner";

// Get the API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export interface GenerateCaptionsRequest {
  tone: string;
  platform: string;
  niche: string;
  goal: string;
  mediaType: 'image' | 'video' | 'text-only';
  postIdea?: string;
}

export interface Caption {
  id: string;
  title: string;
  content: string;
  callToAction: string;
}

export const generateCaptions = async (params: GenerateCaptionsRequest): Promise<Caption[]> => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-api-key-here') {
      toast.error('Please set your OpenAI API key in the .env file');
      console.error('OpenAI API key is missing or using the default placeholder value');
      return [];
    }

    const prompt = `you are the world best content creator and digital, Social Media marketing and sales expert with over 20 years of hands-on experience, Create a highly engaging ${params.tone} caption for ${params.platform} about '${params.postIdea || 'this post'}'. 
    The caption must:
    1. Be concise and tailored to ${params.platform}'s audience and character limits (e.g., Instagram: 2200 characters, Twitter: 200 characters).
    2. Use hashtags relevant to the ${params.niche} industry.
    3. Include an optional call-to-action to drive engagement (e.g., "Comment below," "Tag a friend," "Share your thoughts" etc).
    4. If the goal is to share knowledge, start with words like 'did you know? "Insight", "Fact", etc…
    4. Reflect current trends or platform-specific language where applicable. And post format and size

    Caption 1:
    [Title] A catchy title that highlights the post's theme.
    [Caption] Write a 1-2 sentence caption in a ${params.tone} tone with hashtags.
    [Call to Action] Provide a specific CTA to encourage engagement.

    Caption 2:
    [Title] Another engaging title for a unique post idea.
    [Caption] Write an attention-grabbing caption with relevant hashtags.
    [Call to Action] Include a CTA to drive user interaction.

    Caption 3:
    [Title] Third compelling title idea.
    [Caption] Provide a brief but engaging caption with appropriate hashtags.
    [Call to Action] Suggest a CTA to encourage likes, shares, or comments.`;

    console.log('Sending request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional social media content creator.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', errorData || response.statusText);
      throw new Error(`Failed to generate captions: ${response.statusText}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    console.log('Received response from OpenAI API');

    // Parse the response into structured captions
    const captions = parseCaptions(rawContent);
    return captions;
  } catch (error) {
    console.error('Error generating captions:', error);
    toast.error('Failed to generate captions. Please try again.');
    return [];
  }
};

const parseCaptions = (rawContent: string): Caption[] => {
  const sections = rawContent.split('Caption').filter(Boolean);
  return sections.map((section, index) => {
    const titleMatch = section.match(/\[Title\](.*?)(?=\[Caption\])/s);
    const captionMatch = section.match(/\[Caption\](.*?)(?=\[Call to Action\])/s);
    const ctaMatch = section.match(/\[Call to Action\](.*?)(?=$|\n\n)/s);

    return {
      id: `caption-${index + 1}`,
      title: titleMatch?.[1]?.trim() || 'Untitled',
      content: captionMatch?.[1]?.trim() || '',
      callToAction: ctaMatch?.[1]?.trim() || '',
    };
  });
};
