import { useEffect, useRef, useState } from "react";

import "../../dynamsoft.config"; // import side effects. The license, engineResourcePath, so on.
import { CameraEnhancer, CameraView } from "dynamsoft-camera-enhancer";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import { MultiFrameResultCrossFilter } from "dynamsoft-utility";

const componentDestroyedErrorMsg = "VideoCapture Component Destroyed";


function BarCodeScanner({ onChange }) {
  const cameraViewContainer = useRef()

  useEffect(() => {
    let resolveInit;
    const pInit = new Promise(r => (resolveInit = r));

    let isDestroyed = false, cvRouter, cameraEnhancer;

    (async function () {
      try {
        // Create a `CameraEnhancer` instance for camera control and a `CameraView` instance for UI control.
        const cameraView = await CameraView.createInstance();

        // Check if component is destroyed after every async
        cameraEnhancer = await CameraEnhancer.createInstance(cameraView);

        // Get default UI and append it to DOM.
        cameraViewContainer.current.innerHTML = ""
        cameraViewContainer.current.append(cameraView.getUIElement());

        // Create a `CaptureVisionRouter` instance and set `CameraEnhancer` instance as its image source.
        cvRouter = await CaptureVisionRouter.createInstance();
        cvRouter.setInput(cameraEnhancer);

        // Define a callback for results.
        cvRouter.addResultReceiver({
          onDecodedBarcodesReceived(result) {
            if (!result.barcodeResultItems.length || typeof onChange !== 'function') return;

            onChange(result.barcodeResultItems[0].text)
          },
        });

        // Filter out unchecked and duplicate results.
        const filter = new MultiFrameResultCrossFilter();
        // Filter out unchecked barcodes.
        filter.enableResultCrossVerification("barcode", true);

        // Filter out duplicate barcodes within 3 seconds.
        filter.enableResultDeduplication("barcode", true);

        await cvRouter.addResultFilter(filter);
        if (isDestroyed) throw Error(componentDestroyedErrorMsg);


        // Open camera and start scanning single barcode.
        await cameraEnhancer.open();
        if (isDestroyed) throw Error(componentDestroyedErrorMsg);

        await cvRouter.startCapturing("ReadSingleBarcode");
        if (isDestroyed) throw Error(componentDestroyedErrorMsg);

      } catch (ex) {
        if ((ex)?.message === componentDestroyedErrorMsg) {
          console.log(componentDestroyedErrorMsg);
        } else {
          let errMsg = ex.message || ex;
          console.error(errMsg);

        }
      }
    })();

    // Resolve pInit promise once initialization is complete.
    resolveInit();

    // componentWillUnmount. dispose cvRouter when it's no longer needed
    return async () => {
      isDestroyed = true;
      try {
        // Wait for the pInit to complete before disposing resources.
        await pInit;

        cvRouter?.dispose();
        cameraEnhancer?.dispose();
      } catch (_) { }
    };
  }, []);

  return (
    <div className="h-100 w-100" ref={cameraViewContainer}></div>
  );
}

export default BarCodeScanner;