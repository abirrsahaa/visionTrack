import { apiClient, shouldUseMockData } from "./client";
import type {
  Domain,
  CreateDomainRequest,
  UpdateDomainRequest,
  DomainImage,
} from "@/lib/types";
import { mockDomains6Months as mockDomains } from "@/lib/utils/mockData6Months";

import { getDomains } from "@/app/actions";

// ... existing imports ...

export const domainsApi = {
  getAll: async (): Promise<Domain[]> => {
    // Direct Server Action call
    const domains = await getDomains();
    if (domains && domains.length > 0) return domains;

    // Fallback
    if (shouldUseMockData()) {
      // ... existing mock logic ...
      return mockDomains;
    }

    return [];
  },

  create: async (data: CreateDomainRequest): Promise<Domain> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newDomain: Domain = {
        id: `dom_${Date.now()}`,
        name: data.name,
        description: data.description,
        colorHex: data.colorHex || "#3B82F6",
        sortOrder: mockDomains.length + 1,
        images: [],
        createdAt: new Date().toISOString(),
      };
      mockDomains.push(newDomain);
      return newDomain;
    }

    const response = await apiClient.post<Domain>("/domains", data);
    return response.data;
  },

  update: async (id: string, data: UpdateDomainRequest): Promise<Domain> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const domain = mockDomains.find((d) => d.id === id);
      if (!domain) throw new Error("Domain not found");
      Object.assign(domain, data);
      return domain;
    }

    const response = await apiClient.put<Domain>(`/domains/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = mockDomains.findIndex((d) => d.id === id);
      if (index > -1) mockDomains.splice(index, 1);
      return { success: true };
    }

    const response = await apiClient.delete<{ success: boolean }>(`/domains/${id}`);
    return response.data;
  },

  uploadImage: async (domainId: string, file: File): Promise<DomainImage> => {
    if (shouldUseMockData()) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const domain = mockDomains.find((d) => d.id === domainId);
      if (!domain) throw new Error("Domain not found");

      const newImage: DomainImage = {
        id: `img_${Date.now()}`,
        imageUrl: URL.createObjectURL(file),
        sortOrder: domain.images.length + 1,
        uploadedAt: new Date().toISOString(),
      };
      domain.images.push(newImage);
      return newImage;
    }

    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<DomainImage>(
      `/domains/${domainId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};