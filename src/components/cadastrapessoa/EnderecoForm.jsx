import React, { useState } from "react";
import { Form, Input, Row, Col, Select, message } from "antd";

const { Option } = Select;

function PessoaForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Busca automática no ViaCEP
  const buscarCep = async (cep) => {
    if (cep.length < 8) return;
    setLoading(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        message.error("CEP não encontrado!");
        return;
      }

      // Preenche os campos automaticamente
      form.setFieldsValue({
        endereco: {
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          uf: data.uf,
          regiao: data.regiao || "", 
        },
      });
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
      message.error("Erro ao buscar o CEP!");
    } finally {
      setLoading(false);
    }
  };

  // Função para tratar a digitação do CEP
  const handleCepChange = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, ""); // Mantém apenas números
    form.setFieldValue(["endereco", "cep"], onlyNums);

    // Quando tiver 8 dígitos faz a busca automática
    if (onlyNums.length === 8) buscarCep(onlyNums);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Form form={form} layout="vertical">
        {/* CEP */}
        <Form.Item
          label="CEP"
          name={["endereco", "cep"]}
          rules={[{ required: true, message: "Informe o CEP!" }]}
        >
          <Input
            placeholder="Digite o CEP (somente números)"
            maxLength={8}
            onChange={handleCepChange}
            disabled={loading}
          />
        </Form.Item>

        {/* Logradouro */}
        <Form.Item
          label="Logradouro"
          name={["endereco", "logradouro"]}
          rules={[{ required: true, message: "Informe o logradouro!" }]}
        >
          <Input placeholder="Rua / Avenida" />
        </Form.Item>

        {/* Bairro */}
        <Form.Item
          label="Bairro"
          name={["endereco", "bairro"]}
          rules={[{ required: true, message: "Informe o bairro!" }]}
        >
          <Input placeholder="Bairro" />
        </Form.Item>

        {/* Cidade / UF / Região */}
        <Row gutter={8}>
          <Col span={13}>
            <Form.Item
              label="Cidade"
              name={["endereco", "cidade"]}
              rules={[{ required: true, message: "Informe a cidade!" }]}
            >
              <Input placeholder="Cidade" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              label="UF"
              name={["endereco", "uf"]}
              rules={[{ required: true, message: "Informe a UF!" }]}
            >
              <Input placeholder="UF" maxLength={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Região"
              name={["endereco", "regiao"]}
              rules={[{ required: true, message: "Informe a região!" }]}
            >
              <Select placeholder="Selecione ou aguarde busca" disabled={loading}>
                <Option value="Norte">Norte</Option>
                <Option value="Nordeste">Nordeste</Option>
                <Option value="Centro-Oeste">Centro-Oeste</Option>
                <Option value="Sudeste">Sudeste</Option>
                <Option value="Sul">Sul</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default PessoaForm;
