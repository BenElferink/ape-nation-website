import { PropsWithChildren } from 'react';
import useScreenSize from '../../hooks/useScreenSize';

const MediaWrapper = (props: PropsWithChildren<{ size?: number; isLeft?: boolean; posTop?: string; posSide?: string }>) => {
  const { children, size = 100, isLeft = false, posTop = '0px', posSide } = props;
  const { isMobile, screenWidth } = useScreenSize();

  return (
    <div
      style={
        isMobile
          ? { width: 'fit-content', margin: '0 auto' }
          : {
              width: size,
              height: size,
              position: 'absolute',
              top: posTop,
              right: isLeft ? posSide || ((screenWidth > 900 ? -420 : -screenWidth / 2.2) - size) / 2 : 'unset',
              left: isLeft ? 'unset' : posSide || ((screenWidth > 900 ? -420 : -screenWidth / 2.2) - size) / 2,
              zIndex: 1,
            }
      }
    >
      {children}
    </div>
  );
};

export default MediaWrapper;
