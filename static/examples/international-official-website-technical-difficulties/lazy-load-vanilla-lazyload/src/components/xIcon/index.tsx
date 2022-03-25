import React from 'react';

import styles from './index.module.less';

interface XIconProps {
  name: string;
  color?: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<SVGSVGElement>) => any;
}

const XIcon: React.FC<XIconProps> = (props) => {
  const { name, color, size, className, style } = props;

  if (!name) {
    return null;
  }

  return (
    <svg
      className={`icon ${className} ${styles.iconContainer}`}
      aria-hidden='true'
      style={{ ...style, color, fontSize: size }}
      onClick={(e) => props.onClick && props.onClick(e)}
    >
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  );
};

export default XIcon;
