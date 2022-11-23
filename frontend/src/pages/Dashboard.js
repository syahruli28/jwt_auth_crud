//import hook react
import React, { useState, useEffect } from 'react';

//import hook useHitory from react router dom
import { useHistory } from 'react-router';

import { Link } from 'react-router-dom';

//import axios
import axios from 'axios';

function Dashboard() {

    //state user
    const [user, setUser] = useState({});
    const [products, setProducts] = useState([]);

    //define history
    const history = useHistory();

    //token
    const token = localStorage.getItem("token");

    //function "fetchData"
    const fetchData = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch user from Rest API
        await axios.get('http://localhost:8000/api/user')
        .then((response) => {

            //set response user to state
            setUser(response.data);
        })
    }

    //function "getProducts"
    const getProducts = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch user from Rest API
        await axios.get('http://localhost:8000/api/product')
        .then((response) => {

            //set response user to state
            setProducts(response.data.data);
        })
    }

    //hook useEffect
    useEffect(() => {

        //check token empty
        if(!token) {

            //redirect login page
            history.push('/');
        }
        
        //call function "fetchData"
        fetchData();
        getProducts();
        // console.log(products);
    }, []);

    //function logout
    const logoutHanlder = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch Rest API
        await axios.post('http://localhost:8000/api/logout')
        .then(() => {

            //remove token from localStorage
            localStorage.removeItem("token");

            //redirect halaman login
            history.push('/');
        });
    };

    // fungsi deleteProduct
    const deleteProduct = async(productId) => {
        try {
            //set axios header dengan type Authorization + Bearer token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // hapus dengan api dari tb
            await axios.delete(`http://localhost:8000/api/product/${productId}`); 
            getProducts(); // jalankan fungsi getProduct agar dapat langsung lihat perubahan
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container" style={{ marginTop: "50px" }}>

            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body">
                            SELAMAT DATANG <strong className="text-uppercase">{user.name}</strong>
                            <hr />
                            <button onClick={logoutHanlder} className="btn btn-md btn-danger">Logout</button>
                            {/* <button className="btn btn-md btn-success">Tambah Data</button> */}
                            <Link to="/add" className="btn btn-md btn-success">Tambah Data</Link>

                            <div className="row mt-3">
                                {products.map((product)=>(
                                    <div className="col-md-4" key={product.id}>
                                        <div className="card" style={{ width: "18rem" }}>
                                            <img src={product.url} alt={product.gambar} />
                                            <div className="card-body">
                                                <h5 className="card-title">{product.nama}</h5>
                                                <p className="card-text">Rp. {product.harga}</p>  
                                                <Link to={`/edit/${product.id}`} className="btn btn-primary">Edit</Link>
                                                <a onClick={()=> deleteProduct(product.id)} className="btn btn-danger">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}

export default Dashboard;