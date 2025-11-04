import React, { useState, useEffect } from "react";
import { Table, Button, Input, Select, Space, Popconfirm, message, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import PFDAO from "../../objetos/dao/PFDAOLocalV2.mjs";
import PJDAO from "../../objetos/dao/PJDAOLocalV2.mjs";

const { Option } = Select;

function ListaPessoas() {
  const [tipo, setTipo] = useState("PF");
  const [filtroNome, setFiltroNome] = useState("");
  const [dados, setDados] = useState([]);
  const navigate = useNavigate();

  const pfDAO = new PFDAO();
  const pjDAO = new PJDAO();

  // Carregar lista
  useEffect(() => {
    carregar();
  }, [tipo, filtroNome]);

  function carregar() {
    let lista = tipo === "PF" ? pfDAO.listar() : pjDAO.listar();
    if (filtroNome.trim() !== "") {
      lista = lista.filter((p) =>
        p.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );
    }
    setDados(lista);
  }

  function excluirPessoa(id) {
    if (tipo === "PF") pfDAO.excluir(id);
    else pjDAO.excluir(id);
    message.success("Registro excluído com sucesso!");
    carregar();
  }

  const colunasComuns = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      sorter: (a, b) => a.nome.localeCompare(b.nome),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const colunasEspecificas =
    tipo === "PF"
      ? [
          { title: "CPF", dataIndex: "cpf", key: "cpf" },
          {
            title: "Ações",
            key: "acoes",
            render: (_, record) => (
              <Space>
                <Tooltip title="Visualizar">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/visualizar/PF/${record.cpf}`)}
                  />
                </Tooltip>

                <Tooltip title="Editar">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/editar/PF/${record.cpf}`)}
                  />
                </Tooltip>

                <Popconfirm
                  title="Confirmar exclusão?"
                  onConfirm={() => excluirPessoa(record.cpf)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Tooltip title="Excluir">
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : [
          { title: "CNPJ", dataIndex: "cnpj", key: "cnpj" },
          {
            title: "Ações",
            key: "acoes",
            render: (_, record) => (
              <Space>
                <Tooltip title="Visualizar">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/visualizar/PJ/${record.cnpj}`)}
                  />
                </Tooltip>

                <Tooltip title="Editar">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/editar/PJ/${record.cnpj}`)}
                  />
                </Tooltip>

                <Popconfirm
                  title="Confirmar exclusão?"
                  onConfirm={() => excluirPessoa(record.cnpj)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Tooltip title="Excluir">
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Select value={tipo} onChange={setTipo} style={{ width: 180 }}>
          <Option value="PF">Pessoa Física</Option>
          <Option value="PJ">Pessoa Jurídica</Option>
        </Select>

        <Input
          placeholder="Filtrar por nome..."
          prefix={<SearchOutlined />}
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          style={{ width: 240 }}
        />

        <Button onClick={carregar}>Atualizar</Button>
      </Space>

      <Table
        columns={[...colunasComuns, ...colunasEspecificas]}
        dataSource={dados}
        rowKey={tipo === "PF" ? "cpf" : "cnpj"}
        pagination={{ pageSize: 6 }}
      />
    </>
  );
}

export default ListaPessoas;
