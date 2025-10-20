import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, DatePicker, Row, Col, message } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import EnderecoForm from "./EnderecoForm";
import TelefoneList from "./TelefoneList"; // opcional, se você tiver
import "./pessoaform.css";

function PessoaForm() {
  const [tipo, setTipo] = useState("PF");
  const [form] = Form.useForm();
  const [mostrarTopo, setMostrarTopo] = useState(false);

  // ✅ Submissão
  function onFinish(values) {
    console.log("📋 Dados submetidos:", values);
    message.success("Dados armazenados localmente (modo formulário).");
  }

  // ✅ Alterna entre PF e PJ sem apagar tudo
  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);

    const valoresAtuais = form.getFieldsValue();
    form.setFieldsValue({
      ...valoresAtuais,
      tipo: novoTipo,
    });
  }

  // ✅ Mostrar botão de “voltar ao topo”
  useEffect(() => {
    const verificarScroll = () => {
      setMostrarTopo(window.scrollY > 200);
    };
    window.addEventListener("scroll", verificarScroll);
    return () => window.removeEventListener("scroll", verificarScroll);
  }, []);

  // ✅ Função de scroll suave
  const voltarAoTopo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="main-scroll">
      <div className="form-container">
        <h2>Cadastro de {tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}</h2>

        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Tipo de Pessoa"
            name="tipo"
            initialValue="PF"
            style={{ marginBottom: 10 }}
          >
            <Radio.Group onChange={onChangeTipo}>
              <Radio value="PF">Pessoa Física</Radio>
              <Radio value="PJ">Pessoa Jurídica</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Informe o nome!" }]}
          >
            <Input placeholder="Nome completo ou razão social" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Informe o e-mail!" },
              { type: "email", message: "Formato de e-mail inválido!" },
            ]}
          >
            <Input placeholder="exemplo@email.com" />
          </Form.Item>

          {/* ✅ Endereço Integrado */}
          <EnderecoForm form={form} />

          {/* ✅ Telefones (se existir o componente) */}
          <TelefoneList form={form} />

          {/* ✅ Campos específicos */}
          {tipo === "PF" ? (
            <>
              <Form.Item
                label="CPF"
                name="cpf"
                rules={[{ required: true, message: "Informe o CPF!" }]}
              >
                <Input placeholder="Somente números" maxLength={11} />
              </Form.Item>

              <Form.Item label="Data de Nascimento" name="dataNascimento">
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Título Eleitoral - Número" name={["titulo", "numero"]}>
                <Input placeholder="Número do título" />
              </Form.Item>
              <Form.Item label="Zona" name={["titulo", "zona"]}>
                <Input placeholder="Zona eleitoral" />
              </Form.Item>
              <Form.Item label="Seção" name={["titulo", "secao"]}>
                <Input placeholder="Seção eleitoral" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item
                label="CNPJ"
                name="cnpj"
                rules={[{ required: true, message: "Informe o CNPJ!" }]}
              >
                <Input placeholder="00.000.000/0000-00" />
              </Form.Item>
              <Form.Item label="Inscrição Estadual" name={["ie", "numero"]}>
                <Input placeholder="Número da IE" />
              </Form.Item>
              <Form.Item label="Estado" name={["ie", "estado"]}>
                <Input placeholder="UF" maxLength={2} />
              </Form.Item>
              <Form.Item label="Data de Registro" name={["ie", "dataRegistro"]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Salvar
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Botão flutuante de voltar ao topo */}
      <button
        className={`scroll-top-button ${mostrarTopo ? "" : "hidden"}`}
        onClick={voltarAoTopo}
        title="Voltar ao topo"
      >
        <ArrowUpOutlined />
      </button>
    </div>
  );
}

export default PessoaForm;
