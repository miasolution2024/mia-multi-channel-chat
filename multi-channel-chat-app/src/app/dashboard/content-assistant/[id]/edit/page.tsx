"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ContentAssistantEditView } from "@/sections/content-assistant/view";
import {
  getContentAssistantList,
  type ContentAssistantApiResponse,
} from "@/actions/content-assistant";
import { Content } from "@/sections/content-assistant/view/content-assistant-list-view";
import { LoadingScreen } from "@/components/loading-screen";

// Interface for API response wrapper
interface ApiResponseWrapper {
  data: ContentAssistantApiResponse;
}

// ----------------------------------------------------------------------

// Transform API data to match Content interface
const transformApiData = (
  apiData: ContentAssistantApiResponse | ApiResponseWrapper
): Content => {
  // Check if apiData has 'data' property (wrapped response)
  const data = "data" in apiData ? apiData.data : apiData;
  return {
    ...data,
    id: data.id,
    topic: data.topic || "",
    post_type: data.post_type,
    main_seo_keyword: data.main_seo_keyword || "",
    secondary_seo_keywords: data.secondary_seo_keywords || [],
    customer_group: data.customer_group || [],
    customer_journey: data.customer_journey || [],
    ai_rule_based: data.ai_rule_based || [],
    content_tone: data.content_tone || [],
    additional_notes: data.additional_notes,
    created_at: data.created_at,
    status: data.status || "draft",
    description: data.description,
    action: data.action,
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
