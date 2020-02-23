import {
	useCallback,
	useState,
	MouseEvent,
	SyntheticEvent,
} from 'react';

// Interactive Transform handlers can be applied directly to ReactNodes or
// invoked manually by consumer's own native event handlers.
type InteractiveEvent = SyntheticEvent | Event;

type InteractiveWheelEvent = WheelEvent;

interface Point {
	x: number;
	y: number;
}

interface UseInteractiveTransformOptionsInterface {
  maxScale: number;
  minScale: number;
  scaleRatio: number;
}

export const useInteractiveTransformDefaultOptions: UseInteractiveTransformOptionsInterface = {
  maxScale: 10,
  minScale: 0.1,
  scaleRatio: 0.002,
};

interface UseInteractiveTransformArgsInterface {
	container?: HTMLElement | null;
	element?: HTMLElement | null;
	options?: UseInteractiveTransformOptionsInterface;
}

// const getPanLimit = (scale: number, dimension: number) => (1 - 1 / scale) * dimension / 2;

export function useInteractiveTransform({
	container,
	element,
	options = useInteractiveTransformDefaultOptions,
}: UseInteractiveTransformArgsInterface) {
	const {
    maxScale,
    minScale,
    scaleRatio,
  } = options;

  const [isPanning, setIsPanning] = useState(false);
  const [panStartX, setPanStartX] = useState(0);
  const [panStartY, setPanStartY] = useState(0);
  const [prevTranslateX, setPrevTranslateX] = useState(0);
  const [prevTranslateY, setPrevTranslateY] = useState(0);

  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  // const [isZooming, setIsZooming] = useState(false);
  // const [touches, setTouches] = useState([]);
  // const [zoomStartDistance, setZoomStartDistance] = useState(1);
  // const [zoomStartScale, setZoomStartScale] = useState(1);

	const endInteraction = useCallback(() => {
    setIsPanning(false);
    setPanStartX(0);
    setPanStartY(0);
    setPrevTranslateX(0);
    setPrevTranslateY(0);
    // setIsZooming(false);
    // setTouches([]);
    // setZoomStartDistance(1);
    // setZoomStartScale(1);
  }, []);

	const handlePanStart = useCallback(({ x, y }: Point) => {
    setIsPanning(true);
    setPanStartX(x);
    setPanStartY(y);
    setPrevTranslateX(translateX);
    setPrevTranslateY(translateY);
    // setTouches([{ screenX, screenY }]);
  }, [translateX, translateY]);

  const handlePanMove = useCallback(({ x, y }: Point) => {
    const offsetX = x - panStartX;
    const offsetY = y - panStartY;
    const targetX = prevTranslateX + offsetX / scale;
    const targetY = prevTranslateY + offsetY / scale;
    // const { x, y } = constrain({ scale: state.scale, targetX, targetY });
    setTranslateX(targetX);
    setTranslateY(targetY);
  }, [panStartX, panStartY, prevTranslateX, prevTranslateY, scale]);

	const onMouseDown = useCallback((event: MouseEvent) => {
    handlePanStart({
      x: event.screenX,
      y: event.screenY,
    });
  }, [handlePanStart]);

  const onMouseLeave = useCallback(() => {
    endInteraction();
  }, [endInteraction]);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!isPanning) {
      return;
    }
    handlePanMove({
      x: event.screenX,
      y: event.screenY,
    });
  }, [handlePanMove, isPanning]);

  const onMouseUp = useCallback(() => {
    endInteraction();
  }, [endInteraction]);

//   const constrain = ({ targetScale, targetX, targetY }: {
//   	targetScale: number;
//   	targetX: number;
//   	targetY: number;
//   }) => {
//     let x = targetX;
//     let y = targetY;
//
//     const xLimit = element
//       ? getPanLimit(targetScale, element.clientWidth)
//       : 0;
//     if (x > xLimit) {
//       x = xLimit;
//     } else if (x < -xLimit) {
//       x = -xLimit;
//     }
//     const yLimit = element
//     	? getPanLimit(targetScale, element.clientHeight)
//     	: 0;
//     if (y > yLimit) {
//       y = yLimit;
//     } else if (y < -yLimit) {
//       y = -yLimit;
//     }
//
//     return { x, y };
//   };

  const translateTo = useCallback(({ targetScale, targetX, targetY }) => {
    // const { x, y } = constrain({
    //   targetScale,
    //   targetX,
    //   targetY,
    // });
    setScale(targetScale);
    setTranslateX(targetX);
    setTranslateY(targetY);
  }, []);

  const zoomTo = useCallback((targetScale: number) => {
    translateTo({
      targetScale,
      targetX: translateX,
      targetY: translateY,
    });
  }, [translateTo, translateX, translateY]);

  const onWheel = useCallback(event => {
    const eventX = event.clientX;
    const eventY = event.clientY;
    const targetScale = Math.min(
      Math.max(scale - event.deltaY * scaleRatio, minScale),
      maxScale
    );
    if (!container) {
      zoomTo(targetScale);
      return;
    }
    const mult = targetScale / scale;
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.top + containerRect.height / 2;
    const x = eventX - centerX;
    const y = eventY - centerY;
    const targetX = translateX - (x * mult - x) / targetScale;
    const targetY = translateY - (y * mult - y) / targetScale;
    translateTo({
      targetScale,
      targetX,
      targetY,
    });
  }, [container, maxScale, minScale, scale, scaleRatio, translateX, translateY, translateTo, zoomTo]);

  const transformStyle = (
    `scale(${scale}) ` +
    `translate(${translateX}px, ${translateY}px)`
  );

	return {
		handlers: {
			onMouseDown,
      onMouseLeave,
      onMouseMove,
      onMouseUp,
      onWheel,
		},
		transformStyle,
		translateX,
		translateY,
		scale,
		zoomTo,
	};
}
