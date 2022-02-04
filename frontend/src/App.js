// Stylesheet
import "./App.css";

// Component import
import CarsInfoList from "./components/CarsInfoList/CarsInfoList";

// Inside the return we call the <link> tag at the top
// level with bootstrap links to ensure the entire app
// is served with the boostrap styles
function App() {
  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />
      <CarsInfoList />
    </div>
  );
}

export default App;
