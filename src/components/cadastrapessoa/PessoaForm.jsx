import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, DatePicker, Row, Col, message } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import EnderecoForm from "./EnderecoForm";
import TelefoneList from "./TelefoneList";
import "./pessoaform.css";

function PessoaForm() {
  const [tipo, setTipo] = useState("PF");
  const [form] = Form.useForm();
  const [mostrarTopo, setMostrarTopo] = useState(false);

  function onFinish(values) {
    console.log("📋 Dados submetidos:", values);
    message.success("Dados armazenados localmente (modo formulário).");
  }

  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
  
    // Pega os valores atuais do formulário
    const valoresAtuais = form.getFieldsValue();
  
    // Reseta todos os campos, mas mantém o tipo selecionado
    form.resetFields();
    form.setFieldsValue({
      ...valoresAtuais,
      tipo: novoTipo,
    });
  }
  

  // Mostra/esconde o botão conforme a rolagem
  useEffect(function () {
    function verificarScroll() {
      if (window.scrollY > 200) {
        setMostrarTopo(true);
      } else {
        setMostrarTopo(false);
      }
    }
    window.addEventListener("scroll", verificarScroll);
    return () => window.removeEventListener("scroll", verificarScroll);
  }, []);

  // Função para rolar suavemente até o topo
  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

          <EnderecoForm />
          <TelefoneList form={form} />

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
            <Button type="primary" htmlType="submit" onClick={onFinish} block>
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
