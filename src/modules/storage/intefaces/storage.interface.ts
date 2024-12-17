export interface ImageResource {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string; // Se puede convertir a Date si lo necesitas.
  bytes: number;
  width: number;
  height: number;
  asset_folder: string;
  display_name: string;
  url: string;
  secure_url: string;
}

export interface ListImagesResult {
  resources: ImageResource[];
  next_cursor?: string;
  rate_limit_allowed: number;
  rate_limit_reset_at: string; // Se puede convertir a Date si lo necesitas.
  rate_limit_remaining: number;
}
