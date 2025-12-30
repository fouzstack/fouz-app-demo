import React from 'react';
import toast from 'react-hot-toast';
//import VerificationCode from '../components/login/VerificationCode';
//import Login from '../components/login/Login';
import ProductList from '../components/product-list/ProductList';
import { useUserStore } from '../store/userStore';
import { useCounterStore } from '../store/counterStore';
//import VerifierDarkPremium from '../components/login/VerifierDarkPremium';

const Root = () => {
  const user = useUserStore((state) => state.user);
  const count = useCounterStore((state) => state.count);
  const [sum, setSum] = React.useState(0);

  React.useEffect(() => {
    setSum((st) => st + 1);
  }, [user]);

  React.useEffect(() => {
    if (count > 90) {
      toast.success(
        `${count} El periodo de Prueba se está terminando, contacte al desarrollador, tel: 54278815`,
      );
    }
  }, [count]);

  return (
    <div className={sum > 0 ? '' : ''}>
      {/* {!user.isVerified ? <VerifierDarkPremium /> : <ProductList />} */}
      <ProductList />
    </div>
  );
};

export default Root;
