import axios from "axios";
import { useEffect } from "react";

const App = () => {

  useEffect(() => {
    axios.get('/question').then((data) => {
      console.log(data.data);
    }).catch((err) => {
      console.error(err);
    })
  }, [])

  return (
    <div>
      Hello XJudge
    </div>
  )
}

export default App
