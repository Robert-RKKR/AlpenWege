import { Box, Image, Loader, Center } from "@mantine/core";
import type { BoxProps } from "@mantine/core";
import { useState } from "react";

/**
 * ImageLoaderProps
 *
 * Explicitly allows mouse events while still extending BoxProps.
 * This avoids Mantine typing gaps and keeps strict type safety.
 */
type ImageLoaderProps = BoxProps & {
  src?: string | null;
  alt: string;
  fallback?: string;

  height?: number | string;
  width?: number | string;
  fit?: "cover" | "contain";
  radius?: number | string;

  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClickCapture?: React.MouseEventHandler<HTMLDivElement>;
};

export function ImageLoader({
  src,
  alt,
  fallback = "/empty.jpg",

  height = 160,
  width = "100%",
  fit = "cover",
  radius = "md",

  onClick,
  onClickCapture,

  ...props
}: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageSrc = !src || error ? fallback : src;

  return (
    <Box
      pos="relative"
      h={height}
      w={width}
      style={{ borderRadius: radius, overflow: "hidden" }}
      onClick={onClick}
      onClickCapture={onClickCapture}
      {...props}
    >
      {!loaded && (
        <Center pos="absolute" inset={0} style={{ zIndex: 1 }}>
          <Loader size="sm" />
        </Center>
      )}

      <Image
        src={imageSrc}
        alt={alt}
        fit={fit}
        height="100%"
        width="100%"
        radius={radius}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
      />
    </Box>
  );
}
