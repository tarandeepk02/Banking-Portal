
import Body from "./body";
import Dashboard from "./Dashboard";
import { Header } from "./header";

import { Footer } from "./footer";
const App = () => {
    return (<div className="d-flex flex-column min-vh-100">
        <Header/>
       
        <Body/>
        <Footer/>
       
    </div>
    )
};

export default App;
