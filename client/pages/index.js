import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async context => {
  console.log('LANDING PAGE!');
  try{
    const client = buildClient(context);
    var { data } = await client.get('/api/users/currentuser');
    return data;

  }catch(err){
    return data = null
  }

};

export default LandingPage;
