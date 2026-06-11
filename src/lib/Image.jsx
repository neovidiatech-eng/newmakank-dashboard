/**
 * @param {import("react").ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; objectFit?: string; layout?: string }} props
 */
export default function Image({ src, alt = "", width, height, fill, style, ...props }) {
  const imageStyle = {
    ...(fill ? { width: "100%", height: "100%", objectFit: "cover" } : {}),
    ...style
  };

  return <img src={src} alt={alt} width={width} height={height} style={imageStyle} {...props} />;
}
