export type Metadata = {
  title?: string | { default: string; template: string };
  description?: string;
  openGraph?: Record<string, any>;
  [key: string]: any;
};

export type ResolvingMetadata = Promise<Metadata>;

export default {};
