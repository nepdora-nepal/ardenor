export const siteConfig = {
  name: "Nepdora",
  description: "Nepdora Preview System",
  tenantName: "nextjs-web-container",
  get apiBaseUrl() {
    return process.env.NEXT_PUBLIC_API_URL || `https://${this.tenantName}.nepdora.baliyoventures.com`;
  },
  get mediaBaseUrl() {
    return process.env.NEXT_PUBLIC_MEDIA_URL || `https://nepdora.baliyoventures.com/media/workspaces/${this.tenantName}/public`;
  },
  get endpoints() {
    const apiBase = this.apiBaseUrl;
    return {
      fetchImage: (path: string) => `${this.mediaBaseUrl}/${path.startsWith("/") ? path.slice(1) : path}`,
      listImages: () => `${apiBase}/builder/images-map/${this.tenantName}/`,
      updateImageMap: () => `${apiBase}/builder/update-image-map/${this.tenantName}/`,
      uploadImage: () => `${apiBase}/builder/upload-image/${this.tenantName}/`,
    };
  },
};

export const getApiBaseUrl = (): string => {
  return siteConfig.apiBaseUrl;
};

export const getImageUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  
  const baseUrl = siteConfig.mediaBaseUrl;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};