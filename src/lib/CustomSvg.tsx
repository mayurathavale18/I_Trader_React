import React, { useEffect, useLayoutEffect, useRef } from 'react';

export interface CustomSVGProps {
  svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  colors: { fill?: string; stroke?: string };
  height?: string | number;
  width?: string | number;
  className?: string;
  onClick?: any;
  style?: React.CSSProperties;
}

export const CustomSvg: React.FC<CustomSVGProps> = ({
  svg: ITRADERSVG,
  colors,
  height,
  width,
  className,
  onClick,
  style,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svgElement = svgRef.current;
    if (svgElement) {
      var box = svgElement.getAttribute('viewBox')!;
      const viewBox = box.split(/\s+|,/);
      const viewBoxWidth = viewBox[2];
      const viewBoxHeight = viewBox[3];
      if (width === undefined) {
        svgElement.setAttribute('width', viewBoxWidth);
      }
      if (height === undefined) {
        svgElement.setAttribute('height', viewBoxHeight);
      }
    }
    if (svgElement && colors?.fill) {
      const svgElements = svgElement.querySelectorAll(
        'path, circle, rect, polygon'
      );
      svgElements.forEach((element) => {
        if (colors?.fill) element.setAttribute('fill', colors?.fill);
        if (colors?.stroke) element.setAttribute('stroke', colors?.stroke);
      });
    }
  }, [colors, width, height]);

  if (!ZONOSVG) {
    return null;
  }
  return (
    <ITRADERSVG
      style={{ ...style }}
      ref={svgRef}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
    />
  );
};
