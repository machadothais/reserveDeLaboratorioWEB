import Footer from '../../components/footer/footer';
import Header from '../../components/header/Header';
import NavBar from '../../components/navBar/NavBar';
import Section from '../../components/section/Section';
function Home(){
return(<> <nav><NavBar  links={[
        { to: "/", label: "Home" },
        { to: "/Contatos", label: "Contatos" },
        { to: "/registro-de-reserva", label: "Registro de reserva" },
      
      ]}/></nav>
    <header><Header/></header>
    <section><Section/></section>
    <footer><Footer/></footer></>);
}
export default Home;