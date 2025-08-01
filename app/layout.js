import "./global.css";
import Header from "./component/header";
import Footer from "./component/footer";

const RootLayout = ({children}) => {
  return(
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout;