import { Box, BoxProps, MantineStyleProp } from '@mantine/core';
import { CSSProperties, ReactNode, useEffect } from 'react';
import {
  motion,
  MotionStyle,
  useSpring,
  useTime,
  useTransform,
} from 'motion/react';

interface GlowBoxProps extends BoxProps {
  boxRadius?: number;
  borderWidth?: number;
  children?: ReactNode;
}

function GlowBox({
  boxRadius = 8,
  borderWidth = 4,
  style,
  children,
  ...rest
}: GlowBoxProps) {
  const time = useTime();
  const rotate = useTransform(time, [0, 3000], [0, 360], { clamp: false });
  const rotateBg = useTransform(
    rotate,
    (degrees) => `conic-gradient(
      from ${degrees}deg in oklch,
      oklch(70.98% 0.1681 306.27),
      oklch(85.51% 0.0935 332.88),
      oklch(71.72% 0.1483 276.9),
      oklch(65.75% 0.1885 303.24),
      oklch(70.92% 0.1851 16.46),
      oklch(83.83% 0.1203 66.467),
      oklch(73.24% 0.1788 306.936) 342deg,
      oklch(70.98% 0.1681 306.27)
    )`
  );

  const pulse = useSpring(0, { damping: 0, mass: 5, stiffness: 10 });
  const pulseBg = useTransform(pulse, (pixels) => `blur(${pixels}px)`);

  const containerStyles: CSSProperties = { position: 'relative' };
  const contentStyles: MantineStyleProp = {
    ...style,
    position: 'relative',
    zIndex: 1,
    borderRadius: boxRadius,
    background: 'white',
  };
  const borderStyles: MotionStyle = {
    position: 'absolute',
    inset: `-${borderWidth}px`,
    borderRadius: boxRadius + borderWidth,
    backgroundImage: rotateBg,
  };
  const glowStyles: MotionStyle = {
    position: 'absolute',
    inset: '0px',
    opacity: 0.5,
    borderRadius: boxRadius + borderWidth,
    backgroundImage: rotateBg,
    filter: pulseBg,
  };

  useEffect(() => {
    pulse.set(10);
  }, [pulse]);

  return (
    <div style={containerStyles}>
      <Box style={contentStyles} {...rest}>
        {children}
      </Box>
      <motion.div style={borderStyles} />
      <motion.div style={glowStyles} />
    </div>
  );
}

export default GlowBox;
