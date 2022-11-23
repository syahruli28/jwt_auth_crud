//import hook react
import React, { useState, useEffect } from 'react';

//import hook useHitory from react router dom
import { useHistory } from 'react-router';

// import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

//import axios
import axios from 'axios';

function EditProduct() {
    const [nama, setNama] = useState("");
    const [harga, setHarga] = useState("");
    const [file, setFile] = useState("");
    const [preview, setPreview] = useState("");
    const {id} = useParams();
    //define state validation
    const [validation, setValidation] = useState([]);
    //token
    const token = localStorage.getItem("token");
    //define history
    const history = useHistory();

    //hook useEffect
    useEffect(() => {

        //check token empty
        if(!token) {

            //redirect login page
            history.push('/');
        }
        getProductById();
    }, []);

    // fungsi untuk ambil data dari tb berdasarkan idnya
    const getProductById = async() => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch user from Rest API
        await axios.get(`http://localhost:8000/api/product/${id}`)
        .then((response) => {

            //set response user to state
            setNama(response.data.data.nama);
            setHarga(response.data.data.harga);
            setFile(response.data.data.gambar);
            setPreview(response.data.data.url);
        })
    }

    // fungsi loadImage
    const loadImage = (e) => {
        const image = e.target.files[0]; // ambil data imagenya
        setFile(image); // ubah state filenya dengan image yang dipilih
        setPreview(URL.createObjectURL(image)); // tangkap file/image yang dipilih untuk dipreview
    };

    // fungsi saveProduct
    const updateProduct = async(e) => {
        e.preventDefault(); // agar tidak reload halaman
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append("nama", nama); // "nama" dari backend, nama dari state disini
        formData.append("harga", harga); // "harga" dari backend, harga dari state disini
        if(file!==null){
            formData.append("gambar", file); // "gambar" dari backend, file dari state disini
        }

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //send data to server
        await axios.post(`http://localhost:8000/api/product/${id}`, formData)
        .then(() => {

            //redirect to dashboard page
            history.push('/dashboard');
        })
        .catch((error) => {
            console.log(error);
            //assign error to state "validation"
            setValidation(error.response.data);
        })
    }

    return (
        <div className="container" style={{ marginTop: "50px" }}>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body">
                        
                        {/* validasi */}
                        {
                            validation.message && (
                                <div className="alert alert-danger">
                                    {validation.message}
                                </div>
                            )
                        }

                        <form onSubmit={updateProduct}>
                            <div className="mb-3">
                                <label htmlFor="nama" className="form-label">Nama Produk</label>
                                <input type="text" onChange={(e)=>setNama(e.target.value)} value={nama} placeholder="Nama Produk" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="harga" className="form-label">Harga Produk</label>
                                <input type="number" onChange={(e)=>setHarga(e.target.value)} value={harga} placeholder="Harga Produk" className="form-control" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gambar" className="form-label">Gambar Produk</label>
                                <input type="file" className="form-control" onChange={loadImage} />
                            </div>

                            {/* preview */}
                            {/* tampilkan gambar jika ada nilai di privew, jika tidak ada kosong */}
                            {preview ? (
                                <figure className="card rounded" style={{ width: "18rem" }}>
                                    <img src={preview} alt="Preview Image" />
                                </figure>
                            ):(
                                ""
                            )}

                            <button type="submit" className="btn btn-primary">Update</button>
                        </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default EditProduct;