import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form); // 👈 usamos el login global
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Correo o contraseña incorrectos");
      } else {
        setError("Error al iniciar sesión");
      }
    }
  };

  return (
    <div className="container mt-5" style={{ paddingTop: "80px", minHeight: "100vh" }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" name="email" placeholder="Correo" onChange={handleChange} />
        <input className="form-control mb-2" name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        {error && <div className="alert alert-danger">{error}</div>}
        <button className="btn btn-primary w-100">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
