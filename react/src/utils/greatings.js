// import morningimage from '../images/morning.jpg';
// import eveningImg from '../images/evening_view.jpg'

//both images are sourced from pixabuy erbiste 
//https://pixabay.com/photos/paris-night-scene-france-city-4793193/
//https://pixabay.com/photos/nature-landscape-clouds-view-8838111/
const Greeting = () => {
    const hour = new Date().getHours();
    const isMorning = hour < 12;
    const greeting = isMorning ? "Good Morning" : "Good Evening";
    const backgroundImage = isMorning ? '../images/morning.jpg' : '../images/evening_view.jpg';
  
    const clsName = isMorning ? "text-dark" : "text-light";

    return (
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <p className={`${clsName} mb-0`} style={{ fontSize: '24px', fontWeight: 'bold' }}>Hello {greeting}!</p>
      </div>
    );
  };
  
  export default Greeting;