import Lottie from 'lottie-react';
import LoaderAnimation from '../src/assets/Loader/Animation - 1742542054644.json'

const Loader = () => {
  return (
    <div style={{top:0,left:0,height:"100vh",width:"100vw",display:'flex',justifyContent:'center',alignItems:'center',zIndex:5}}>
    <Lottie animationData={LoaderAnimation} style={{ width:'50',height:'50'}}/>
    </div>
  )
}

export default Loader