import * as mobilenet from "@tensorflow-models/mobilenet"; // used for image classification and identification
import { useState, useEffect, useRef } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null); // model is stored in this state
  const [imageURL, setImageURL] = useState(null);
  const [results, setResults] = useState([]);

  const imageRef = useRef();
  const textInputRef = useRef();

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch (error) {
      console.log(error);
      setIsModelLoading(false);
    }
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      let url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  const identify = async () => {
    textInputRef.current.value = "";
    const result = await model.classify(imageRef.current);
    setResults(result);
  };

  const handleOnChange = (e) => {
    setImageURL(e.target.value);
    setResults([]);
  };

  useEffect(() => {
    loadModel();
  }, []);

  if (isModelLoading) {
    return (
      <div className="container">
        <div className="loader">
          <div className="circle" id="a"></div>
          <div className="circle" id="b"></div>
          <div className="circle" id="c"></div>
        </div>
        <div className="caption">We're testing your patience😉....</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>WILD GUESS</h1>
      </div>

      <div className="intro">
        <h3>
          Upload any "WILD" image like animals,birds,fruits,etc and see the
          result 🤪...
        </h3>
      </div>

      <div className="inputHolder">
        <label htmlFor="image">
          <i className="upload">Upload&nbsp;🔼</i>
        </label>
        <input
          type="file"
          accept="image/*"
          capture="camera"
          id="image"
          className="uploadInput"
          style={{ display: "none" }}
          onChange={uploadImage}
        />
        <span className="or">OR</span>
        <input
          className="pasteUrl"
          type="text"
          placeholder="Paste Image URL here"
          ref={textInputRef}
          onChange={handleOnChange}
          style={{ margin: "0 5px" }}
        />
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
            {imageURL && (
              <img
                src={imageURL}
                alt="Upload Preview"
                crossOrigin="anonymous"
                ref={imageRef}
              />
            )}
          </div>
          {results.length > 0 && (
            <div className="resultsHolder">
              {results.map((result, index) => {
                return (
                  <div className="result" key={result.className}>
                    <span className="name">{result.className}</span>
                    <span className="confidence">
                      Confidence level:{(result.probability * 100).toFixed(2)}%
                      {index === 0 && (
                        <span className="bestGuess">Best Guess</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="buttondiv">
          {imageURL && (
            <button className="button" onClick={identify}>
              Identify Image
            </button>
          )}
        </div>
      </div>
      <div className="footer">
        <div className="copyright">© 2021 | All rights reserved</div>
      </div>
    </div>
  );
}

export default App;
