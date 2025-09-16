"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ContentAssistantEditView } from "@/sections/content-assistant/view";
import {
  getContentAssistantList,
  type ContentAssistantApiResponse,
  type MediaGeneratedAiItem,
} from "@/actions/content-assistant";
import { Content } from "@/sections/content-assistant/view/content-assistant-list-view";
import { LoadingScreen } from "@/components/loading-screen";
import { CONFIG } from "@/config-global";

// Interface for API response wrapper
interface ApiResponseWrapper {
  data: ContentAssistantApiResponse;
}

// ----------------------------------------------------------------------

// Helper function to transform media items to File-like objects
 const transformMediaItems = (mediaItems: MediaGeneratedAiItem[]): File[] => {
  return mediaItems.map((mediaItem: MediaGeneratedAiItem) => {
    const imageUrl = `${CONFIG.serverUrl}/assets/${mediaItem.directus_files_id}`;
    // Create a File-like object that RHFUpload can handle
    const file = new File([], `image-${mediaItem.id}`, {
      type: "image/jpeg",
    });
    // Add custom properties for preview
    Object.defineProperty(file, "preview", {
      value: imageUrl,
      writable: false,
    });
    Object.defineProperty(file, "idItem", {
      value: mediaItem.id,
      writable: false,
    });
    Object.defineProperty(file, "path", {
      value: `image-${mediaItem.id}`,
      writable: false,
    });
    return file;
  });
};

// Transform API data to match Content interface
const transformApiData = (
  apiData: ContentAssistantApiResponse | ApiResponseWrapper
): Content => {
  // Check if apiData has 'data' property (wrapped response)
  const data = "data" in apiData ? apiData.data : apiData;

  // Transform media data from API to File-like objects for RHFUpload
  const transformedMedia = Array.isArray(data.media)
    ? transformMediaItems(data.media as unknown as MediaGeneratedAiItem[])
    : [];

  return {
    ...data,
    id: data.id,
    topic: data.topic || "",
    post_type: data.post_type,
    main_seo_keyword: data.main_seo_keyword || "",
    secondary_seo_keywords: data.secondary_seo_keywords || [],
    customer_group: (data.customer_group || []) as unknown as Content['customer_group'],
    customer_journey: (data.customer_journey || []) as unknown as Content['customer_journey'],
    ai_rule_based: (data.ai_rule_based || []) as unknown as Content['ai_rule_based'],
    content_tone: (data.content_tone || []) as unknown as Content['content_tone'],
    omni_channels: (data.omni_channels || []) as unknown as Content['omni_channels'],
    status: data.status || "draft",
    current_step: data.current_step,
    outline_post: data.outline_post ?? undefined,
    post_goal: data.post_goal ?? undefined,
    post_notes: data.post_notes ?? undefined,
    post_html_format: data.post_html_format ?? undefined,
    video: data.video || "",
    media: transformedMedia,
    media_generated_ai: data.media_generated_ai || [],
  };
};

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [editData, setEditData] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getContentAssistantList({
          id: Number(id),
        });
        const transformedData = transformApiData(data.data[0]);
        setEditData(transformedData);
      } catch (err) {
        console.error("Error loading content assistant:", err);
        setError("Không thể tải thông tin nội dung");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id, searchParams]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!editData) {
    return <div>Không tìm thấy dữ liệu</div>;
  }

  return <ContentAssistantEditView editData={editData} />;
}
