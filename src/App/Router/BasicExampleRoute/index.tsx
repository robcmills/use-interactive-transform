import React, { CSSProperties } from 'react';
import cn from 'classnames';

import styles from './styles.module.css';
import reactLogo from '../logo.svg';

import { useInteractiveTransform } from '../../../useInteractiveTransform';

export function BasicExampleRoute() {
  const { handlers, translateX, translateY } = useInteractiveTransform();

  const transform = (
    `translate(${translateX}px, ${translateY}px)`
  );

  const imgStyle = {
    transform,
  } as CSSProperties;

  return (
    <div className={styles.page}>
      <h2>Basic Example</h2>
      <p>Scroll to zoom. Click and drag to pan.</p>

      <div className={styles.container} {...handlers}>
        <img
          alt="react-logo-svg"
          className={cn(styles.img, styles.undraggable)}
          src={reactLogo}
          style={imgStyle}
        />
      </div>
    </div>
  );
}
