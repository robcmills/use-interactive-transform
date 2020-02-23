import React, {
	useCallback,
	useState,
	MouseEvent,
	SyntheticEvent,
} from 'react';

// Interactive Transform handlers can be applied directly to ReactNodes or
// invoked manually by consumer's own native event handlers.
type InteractiveEvent = SyntheticEvent | Event;

interface Point {
	x: number;
	y: number;
}

export function useInteractiveTransform() {
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

	return {
		handlers: {
			onMouseDown,
      onMouseLeave,
      onMouseMove,
      onMouseUp,
		},
		translateX,
		translateY,
	};
}
