"use client";

import styles from "@/app/components/footer/Mountains.module.css";
import { usePathname } from "next/navigation";
import Tree from "@/app/components/footer/Tree";
import trees from "@/app/components/footer/trees";
import Boop from "@/app/components/Boop";
import { useCallback, useMemo } from "react";

const MOUNTAIN_COLORS = {
  dark: {
    layer1: "rgb(16, 25, 78)",
    layer2: "rgb(27, 55, 112)",
    layer3: "rgb(37, 93, 159)",
    hills: "rgb(50, 147, 105)",
  },
  light: {
    layer1: "rgb(0, 122, 106)",
    layer2: "rgb(5, 136, 124)",
    layer3: "rgb(33, 155, 140)",
    hills: "rgb(112, 193, 112)",
  },
};

export default function Mountains() {
  const darkmode = false;
  const pathname = usePathname();

  const scrollPos = useCallback((pathname, layer) => {
    let baseScroll = 50;
    const scrollDistance = layer * 50;

    return `0px`;
    // switch (pathname) {
    //   case "/":
    //     return `0px`;
    //   case "/blog":
    //     return `-${scrollDistance}px`;
    //   case "/contact":
    //     return `${scrollDistance + baseScroll}px`;
    //   default:
    //     return `${scrollDistance}px`;
    // }
  }, []);

  const treeElements = useMemo(
    () =>
      trees.map((tree, i) => (
        <Boop
          key={`tree${i}`}
          boopConfig={{
            x: tree.x,
            y: tree.y,
            rotation: tree.rotation,
            scaleX: tree.scaleX,
            scaleY: tree.scaleY,
            transformOrigin: "bottom center",
          }}
        >
          <Tree />
        </Boop>
      )),
    []
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={styles.mountains}
      //width={3000} height={300}
      viewBox="0 0 3000 400"
      //style={{ zIndex: 2, marginTop: 33 }}
      style={{ zIndex: 2 }}
    >
      {/* Sky */}
      {/* <rect x="5.969" y="-42.493" width="1017.46" height="134.648"
            className={styles.mountain}
            style={{
                scale: 3,
                fill: darkmode ? 'rgb(5, 5, 49)' : 'rgb(160, 218, 226)'
            }} /> */}

      {/* Mountain Layer 1 */}
      <path
        className={styles.mountain}
        style={{
          fill: darkmode
            ? MOUNTAIN_COLORS.dark.layer1
            : MOUNTAIN_COLORS.light.layer1,
          transition: "transform 1s ease",
          transform: `translateX(${scrollPos(pathname, 1)}) scale(3.0)`,
        }}
        d="M 814.121 89.205 L 227.804 89.274 L 229.753 54.072 C 229.753 54.072 249.12 57.694 261.679 47.695 C 271.07 40.218 281.704 58.095 289.096 55.547 C 301.963 51.112 320.664 59.295 334.509 59.918 C 366.96 61.377 409.283 64.428 439.319 52.057 C 446.937 48.919 452.325 37.628 460.564 37.598 C 469.977 37.564 472.23 31.347 481.462 33.475 C 487.015 34.755 485.994 41.878 496.806 43.097 C 513.727 45.004 516.536 51.344 524.942 58.721 C 533.174 65.945 536.781 35.878 547.733 36.036 C 561.642 36.237 565.387 58.912 579.03 62.133 C 599.513 66.969 621.823 63.107 642.399 58.684 C 654.009 56.189 660.401 56.515 670.997 50.967 C 675.959 48.369 685.675 32.118 690.859 34.132 C 700.709 37.959 713.226 62.563 730.507 55.574 C 739.76 51.832 765.618 61.067 772.413 59.487 C 781.417 57.394 784.051 49.401 789.749 52.93 C 803.798 61.632 813.969 63.717 813.969 63.717 L 814.121 89.205 Z"
      />
      {/* Mountain Layer 2 */}
      <path
        className={styles.mountain}
        style={{
          //paintOrder: 'fill',
          fillRule: "nonzero",
          fill: darkmode
            ? MOUNTAIN_COLORS.dark.layer2
            : MOUNTAIN_COLORS.light.layer2,
          transition: "transform 1s ease",
          transform: `translateX(${scrollPos(pathname, 2)}) scale(3.0)`,
        }}
        d="M 5.358 89.618 L 1023.966 89.203 L 1023.882 78.741 L 969.907 69.738 C 969.907 69.738 927.596 62.22 910.757 65.994 C 881.879 72.466 860.365 61.678 836.647 56.5 C 821.963 53.294 794.885 73.098 777.475 70.814 C 755.848 67.975 745.086 40.97 723.583 43.446 C 713.161 44.647 706.116 52.298 696.187 54.873 C 686.922 57.276 680.024 58.006 670.314 56.83 C 660.013 55.582 652.354 46.012 642.266 44.064 C 635.088 42.678 629.292 47.701 622.696 45.238 C 604.875 38.582 598.199 -7.795 581.386 12.365 C 564.445 32.679 552.878 64.054 520.506 68.326 C 483.645 73.193 451.834 35.993 434.078 24.888 C 426.204 19.963 415.862 36.93 401.465 29.584 C 392.323 24.919 387.237 12.597 377.004 15.887 C 364.945 19.764 359.549 28.077 352.543 34.672 C 335.264 50.935 286.564 68.078 257.318 65.265 C 241.894 63.781 236.754 39.485 208.251 46.607 C 193.115 50.39 179.368 67.01 155.272 69.298 C 136.392 71.091 121.547 53.798 104.36 59.395 C 84.503 65.859 69.097 71.511 50.81 74.723 C 35.933 77.336 5.602 77.847 5.602 77.847 L 5.358 89.618 Z"
      />
      {/* Mountain Layer 3 */}
      <path
        className={styles.mountain}
        style={{
          fill: darkmode
            ? MOUNTAIN_COLORS.dark.layer3
            : MOUNTAIN_COLORS.light.layer3,
          transition: "transform 1s ease",
          transform: `translateX(${scrollPos(pathname, 3)}) scale(3.0)`,
        }}
        d="M 5.393 89.26 L 5.496 108.173 L 1023.822 108.084 L 1023.618 83.839 C 1023.618 83.839 975.145 75.692 951.133 76.553 C 929.606 77.325 908.979 88.923 887.475 87.674 C 877.623 87.102 868.95 79.791 859.097 79.237 C 840.947 78.217 823.586 88.566 805.409 88.824 C 774.263 89.267 744.13 74.379 712.988 75.019 C 697.373 75.34 682.526 85.24 666.97 83.839 C 652.5 82.535 641.983 80.606 627.457 80.341 C 605.146 79.934 586.093 85.681 563.812 86.907 C 549.94 87.67 538.729 80.578 518.329 78.087 C 499.236 75.755 487.767 81.907 468.68 79.528 C 449.906 77.188 451.007 76.621 431.709 67.95 C 414.96 60.424 401.514 78.583 390.311 78.834 C 382.353 79.012 370.414 72.29 362.495 73.089 C 355.376 73.807 342.885 80.466 336.088 82.702 C 309.396 91.483 291.641 80.641 263.543 80.387 C 233.434 80.115 203.435 88.997 173.423 86.566 C 158.897 85.39 145.419 77.15 130.856 76.595 C 108.364 75.738 86.532 84.775 64.129 86.949 C 44.729 88.832 5.393 89.26 5.393 89.26 Z"
      />

      {/* Tree */}
      <g
        style={{
          transition: "transform 1s ease",
          transform: `translateX(${scrollPos(pathname, 4)})`,
        }}
      >
        {treeElements}
      </g>

      {/* rolling hills */}
      <path
        className={styles.mountain}
        style={{
          transition: "transform 1s ease",
          transform: `translateX(${scrollPos(pathname, 4)}) scale(3.0)`,
          //scale: 3,
          fill: darkmode
            ? MOUNTAIN_COLORS.dark.hills
            : MOUNTAIN_COLORS.light.hills,
        }}
        d="M 5.114 112.431 C 5.114 112.431 41.508 116.65 61.391 123.73 C 88.907 133.529 121.616 130.804 151.479 135.956 C 197.694 143.929 255.486 169.118 289.176 164.841 C 331.383 159.483 334.189 141.986 375.246 139.854 C 405.595 138.278 424.239 149.12 447.141 148.366 C 477.615 147.363 495.521 136.83 533.82 140.151 C 565.366 142.887 655.941 166.229 712.217 163.54 C 759.753 161.268 812.448 145.599 852.882 146.098 C 890.155 146.559 923.887 143.674 949.522 135.271 C 990.275 121.913 1023.29 117.284 1023.29 117.284 L 1023.4 97.509 C 1023.4 97.509 973.276 99.345 921.167 95.841 C 874.458 92.7 826.388 84.234 797.298 83.362 C 765.481 82.409 748.458 87.162 716.783 84.414 C 690.346 82.12 680.131 68.85 653.594 67.685 C 628.491 66.584 624.595 70.313 595.388 78.519 C 557.184 89.254 555.004 86.229 534.485 88.442 C 504.237 91.704 463.82 88.629 433.342 89.212 C 396.291 89.921 368.857 98.984 331.847 97.322 C 302.966 96.024 273.347 99.006 244.915 94.45 C 231.15 92.245 218.729 85.428 204.935 83.362 C 187.128 80.696 168.771 80.749 150.741 81.833 C 116.257 83.905 83.125 96.281 48.571 97.127 C 34.416 97.474 5.493 92.921 5.493 92.921 L 5.114 112.431 Z"
      />
    </svg>
  );
}
