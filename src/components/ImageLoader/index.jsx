import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import './styles.css';

const options = {};

const isIntersectionObserverSupported = () =>
  window && 'IntersectionObserver' in window;

// This component need one of the below set of information to render loader properly.
// 1. width of the dynamicHeightImgContainer + heightInPercentage.
// 2. width and height of the dynamicHeightImgContainer.
//
// the width of dynamicHeightImgContainer in both the cases above
// need to be provided only if you do not want
// the ImageLoader to take width of the parent of ImageLoade.

const ImageLoader = ({
  imgUrl,
  heightInPercentage,
  imgContainerClass,
  imgStyles = '',
  alt,
  sourcesString = '',
  sizesString = '',
  onClick = () => {},
  showLargeLoaderAnimation = false,
  showLoader = true
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageInViewport, setIsImageInViewport] = useState(false);
  const imageLoaderRef = useRef(null);

  useEffect(() => {
    if (isIntersectionObserverSupported()) {
      const observer = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsImageInViewport(true);
          observer.disconnect(); // stop observing after triggering image load.
        }
      });
      observer.observe(imageLoaderRef.current);
    } else {
      loadImage(imgUrl);
    }
  }, []);

  return (
    <div className={imgContainerClass} ref={imageLoaderRef}>
      <div
        className={classnames(
          'DynamicHeightImg',
          !isImageLoaded && showLoader && 'animated-bg-placeholder',
          !isImageLoaded &&
            showLargeLoaderAnimation &&
            showLoader &&
            'lg-animated-bg-placeholder'
        )}
        style={{ paddingTop: heightInPercentage }}
      >
        <img
          srcSet={isImageInViewport ? sourcesString : null}
          sizes={sizesString}
          src={isImageInViewport ? imgUrl : null}
          style={{
            display: isImageInViewport && isImageLoaded ? 'block' : 'none'
          }}
          onClick={onClick}
          className={`${imgStyles} full-width`}
          alt={alt}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>
    </div>
  );
};

export default ImageLoader;
