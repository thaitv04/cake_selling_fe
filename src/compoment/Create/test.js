import { faCartShopping, faBars, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import "../Reponsive/Reponsive.css";
import { useFormik } from 'formik';
import "../Admin/Admin.css";

export default function Test() {
    const [imagePreviews, setImagePreviews] = useState([]);
    const [order, setOrder] = useState([]);
    const id_user = sessionStorage.getItem('user_id');
    const [type, setType] = useState([]);
    const [currentCake, setCurrentCake] = useState(null); // To hold the current cake being edited

    // Fetch cake types when the component mounts
    async function getType() {
        try {
            const rep = await axios.get('http://localhost:8080/api/cake/typeCake');
            setType(rep.data);
        } catch (error) {
            console.error('Error fetching cake types:', error);
        }
    }

    useEffect(() => {
        getType();
    }, []);

    useEffect(() => {
        async function fetchCakes() {
            try {
                const response = await axios.get('http://localhost:8080/api/cake');
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching cake data:', error);
            }
        }
        fetchCakes();
    }, []);

    const formUpdate = useFormik({
        initialValues: {
            id: '',
            code: "",
            name: "",
            description: '',
            price: "",
            quantity: "",
            iduser: id_user,
            typeOfCake: ''
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("id", values.id);
            formData.append("code", values.code);
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("quantity", values.quantity);
            formData.append("id_user", values.iduser);
            formData.append("typeOfCake", values.typeOfCake);

            for (let i = 0; i < imagePreviews.length; i++) {
                formData.append("image", imagePreviews[i]);
            }

            try {
                await axios.put(`http://localhost:8080/api/cake/${values.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                window.location.href = '/admin';
            } catch (error) {
                console.error('Error updating cake:', error);
            }
        }
    });

    const handleImageChanges = (event) => {
        const files = Array.from(event.target.files);
        setImagePreviews([...imagePreviews, ...files]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...imagePreviews];
        updatedImages.splice(index, 1);
        setImagePreviews(updatedImages);
    };

    const handleEditClick = (cake) => {
        setCurrentCake(cake);
        formUpdate.setValues({
            id: cake.id,
            code: cake.code,
            name: cake.name,
            description: cake.description,
            price: cake.price,
            quantity: cake.quantity,
            iduser: id_user,
            typeOfCake: cake.typeOfCake?.id || '',
        });
        setImagePreviews([]); // Reset image previews when editing a new cake
    };

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Tên bánh </th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {order.map((cake, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td className='td_img'>
                                <img className='admin_img' src={process.env.PUBLIC_URL + '/img/' + (cake.image[0]?.name || '')} alt={cake.name} />
                            </td>
                            <td>{cake.name}</td>
                            <td>{cake.quantity}</td>
                            <td>{cake.price} VNĐ</td>
                            <td>
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleEditClick(cake)}>
                                    Sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Sửa sản phẩm</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={formUpdate.handleSubmit}>
                            <div className="modal-body">
                                <div className='admin_add'>
                                    <div className='add_name'>
                                        <label htmlFor="inputName" className="form-label">Tên bánh:</label>
                                        <input type="text" className="form-control" name="name" id="name" value={formUpdate.values.name} onChange={formUpdate.handleChange} />
                                    </div>
                                    <div className='add_code'>
                                        <label htmlFor="inputCode" className="form-label">Mã bánh:</label>
                                        <input type="text" className="form-control" name="code" id="code" value={formUpdate.values.code} onChange={formUpdate.handleChange} />
                                    </div>
                                    <div className='add_price'>
                                        <label htmlFor="inputPrice" className="form-label">Giá:</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" aria-label="Dollar amount (with dot and two decimal places)" name='price' value={formUpdate.values.price} onChange={formUpdate.handleChange} />
                                            <span className="input-group-text">VNĐ</span>
                                        </div>
                                    </div>
                                    <div className='add_quantity'>
                                        <label htmlFor="inputCode" className="form-label">Số lượng:</label>
                                        <input type="text" className="form-control" name="quantity" id="quantity" value={formUpdate.values.quantity} onChange={formUpdate.handleChange} />
                                    </div>
                                    <div className='add_description'>
                                        <div className="form-floating">
                                            <textarea className="form-control" placeholder="Leave a comment here" name="description" id="description" value={formUpdate.values.description} onChange={formUpdate.handleChange} style={{ height: "150px" }}></textarea>
                                            <label htmlFor="floatingTextarea2">Mô tả</label>
                                        </div>
                                    </div>
                                    <div className='add_lb'>
                                        <select
                                            id="typeOfCake"
                                            name="typeOfCake"
                                            className="form-control"
                                            value={formUpdate.values.typeOfCake}
                                            onChange={formUpdate.handleChange}>
                                            {type.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-4" style={{ width: "32%", marginLeft: "1%", marginTop: "3%" }}>
                                        <div className="col-md" style={{ marginLeft: "1%" }}>
                                            <div className="file-upload-wrapper">
                                                <input
                                                    className="file-upload"
                                                    accept="image/*"
                                                    name="imagePreviews"
                                                    onChange={handleImageChanges}
                                                    type="file"
                                                    id="formFileMultiple"
                                                    multiple />
                                                <label htmlFor="file-upload">Thêm ảnh</label>
                                            </div>
                                        </div>
                                        {imagePreviews.length > 0 && (
                                            <div>
                                                <div className="row">
                                                    {imagePreviews.map((image, index) => (
                                                        <div key={index} className="imagePreviews">
                                                            <div className="position-relative">
                                                                <img
                                                                    src={URL.createObjectURL(image)}
                                                                    alt={`Image ${index}`}
                                                                    className="img-fluid"
                                                                />
                                                            </div>
                                                            <div>
                                                                <FontAwesomeIcon icon={faRectangleXmark}
                                                                    onClick={() => handleRemoveImage(index)}
                                                                    style={{ width: "100%" }} />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
