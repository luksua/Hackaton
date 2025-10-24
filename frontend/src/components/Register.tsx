import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // 👈 importante

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 👈 usamos el login global
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    role: "tenant",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1️⃣ registrar el usuario en el backend
      await axios.post("http://127.0.0.1:8000/api/register", form);

      // 2️⃣ iniciar sesión automáticamente usando el contexto
      await login({ email: form.email, password: form.password });

      // 3️⃣ redirigir al inicio
      navigate("/");
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        console.error("Error al registrarse:", err);
        alert("Error desconocido. Revisa la consola.");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="name" placeholder="Nombre" onChange={handleChange} />
        {errors.name && <small className="text-danger">{errors.name[0]}</small>}

        <input className="form-control mb-2" name="email" type="email" placeholder="Email" onChange={handleChange} />
        {errors.email && <small className="text-danger">{errors.email[0]}</small>}

        <input className="form-control mb-2" name="phone" placeholder="Teléfono" onChange={handleChange} />
        {errors.phone && <small className="text-danger">{errors.phone[0]}</small>}

        <select className="form-select mb-2" name="role" onChange={handleChange} value={form.role}>
          <option value="tenant">Inquilino</option>
          <option value="owner">Propietario</option>
        </select>
        {errors.role && <small className="text-danger">{errors.role[0]}</small>}

        <input className="form-control mb-2" name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        <input className="form-control mb-2" name="password_confirmation" type="password" placeholder="Confirmar Contraseña" onChange={handleChange} />
        {errors.password && <small className="text-danger">{errors.password[0]}</small>}

        <button className="btn btn-primary w-100">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
