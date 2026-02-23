import api from "./api";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Analysis, HistoryFilters } from "@/types/analysis";

export const analysisService = {
  async submitAnalysis(
    file: File,
    portfolioUrl: string,
    jobDescription: string,
    onUploadProgress?: (percent: number) => void,
  ): Promise<Analysis> {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("portfolioUrl", portfolioUrl);
    formData.append("jobDescription", jobDescription);

    const { data } = await api.post<ApiResponse<Analysis>>(
      "/analyses",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onUploadProgress?.(percent);
          }
        },
      },
    );
    return data.data;
  },

  async getAnalysis(id: string): Promise<Analysis> {
    const { data } = await api.get<ApiResponse<Analysis>>(`/analyses/${id}`);
    return data.data;
  },

  async getHistory(
    filters?: HistoryFilters,
  ): Promise<PaginatedResponse<Analysis>> {
    const params = new URLSearchParams();
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    if (filters?.search) params.set("search", filters.search);
    if (filters?.status) params.set("status", filters.status);

    const { data } = await api.get<PaginatedResponse<Analysis>>("/analyses", {
      params,
    });
    return data;
  },

  async downloadReport(id: string): Promise<Blob> {
    const { data } = await api.get(`/analyses/${id}/download`, {
      responseType: "blob",
    });
    return data as Blob;
  },

  async deleteAnalysis(id: string): Promise<void> {
    await api.delete(`/analyses/${id}`);
  },
};
