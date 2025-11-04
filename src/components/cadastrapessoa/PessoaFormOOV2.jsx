import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, message, Modal } from "antd";
import { useParams, useNavigate } from "react-router-dom";

// Subcomponentes (mantida a ordem: Endereço, Telefones, depois PF/PJ)
import EnderecoFormEX from "./EnderecoFormEXV2.jsx";
import TelefoneListOO from "./TelefoneListOOV2.jsx";
import PFForm from "./PFForm.jsx";
import PJForm from "./PJForm.jsx";

// DAOs
import PFDAO from "../../objetos/dao/PFDAOLocalV2.mjs";
import PJDAO from "../../objetos/dao/PJDAOLocalV2.mjs";

// Modelos
import PF from "../../objetos/pessoas/PF.mjs";
import PJ from "../../objetos/pessoas/PJ.mjs";
import Endereco from "../../objetos/pessoas/Endereco.mjs";
import Telefone from "../../objetos/pessoas/Telefone.mjs";
import Titulo from "../../objetos/pessoas/Titulo.mjs";
import IE from "../../objetos/pessoas/IE.mjs";

function PessoaFormOO() {
  const [tipo, setTipo] = useState("PF");
  const [form] = Form.useForm();
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const pfDAO = new PFDAO();
  const pjDAO = new PJDAO();

  // Carrega dados para edição OU limpa no cadastro
  useEffect(() => {
    const scrollTop = () => {
      const c = document.getElementById("scrollContainer");
      if (c) c.scrollTo({ top: 0, behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);
      const dao = tipoParam === "PF" ? pfDAO : pjDAO;
      const pessoa = dao.listar().find((p) =>
        tipoParam === "PF" ? p.cpf === id : p.cnpj === id
      );

      if (pessoa) {
        // Define todos os valores antes de renderizar a lista de telefones
        const valores = {
          tipo: tipoParam,
          nome: pessoa.nome,
          email: pessoa.email,
          endereco: pessoa.endereco || {},
          telefones: pessoa.telefones || [],
          ...(tipoParam === "PF"
            ? { cpf: pessoa.cpf, titulo: pessoa.titulo || {} }
            : { cnpj: pessoa.cnpj, ie: pessoa.ie || {} }),
        };
        form.setFieldsValue(valores);
        // força reposicionamento visual
        setTimeout(scrollTop, 50);
      }
    } else {
      // Novo cadastro: limpa tudo e volta para PF por padrão
      setEditando(false);
      setTipo("PF");
      form.resetFields();
      setTimeout(scrollTop, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, tipoParam]);

  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    const atuais = form.getFieldsValue();
    form.resetFields();
    form.setFieldsValue({ ...atuais, tipo: novoTipo });
  }

  async function onFinish(values) {
    try {
      // Endereço
      const e = values.endereco || {};
      const end = new Endereco();
      end.setCep(e.cep);
      end.setLogradouro(e.logradouro);
      end.setBairro(e.bairro);
      end.setCidade(e.cidade);
      end.setUf(e.uf);
      end.setRegiao(e.regiao);

      // Monta PF/PJ
      let pessoa;
      if (values.tipo === "PF") {
        const pf = new PF();
        pf.setNome(values.nome);
        pf.setEmail(values.email);
        pf.setCPF(values.cpf);
        pf.setEndereco(end);

        if (values.titulo) {
          const t = new Titulo();
          t.setNumero(values.titulo.numero);
          t.setZona(values.titulo.zona);
          t.setSecao(values.titulo.secao);
          pf.setTitulo(t);
        }
        (values.telefones || []).forEach((tel) => {
          const f = new Telefone();
          f.setDdd(tel.ddd);
          f.setNumero(tel.numero);
          pf.addTelefone(f);
        });
        pessoa = pf;
      } else {
        const pj = new PJ();
        pj.setNome(values.nome);
        pj.setEmail(values.email);
        pj.setCNPJ(values.cnpj); // CNPJ CONTINUA NO PJForm, mas vem no values
        pj.setEndereco(end);

        if (values.ie) {
          const i = new IE();
          i.setNumero(values.ie.numero);
          i.setEstado(values.ie.estado);
          i.setDataRegistro(values.ie.dataRegistro);
          pj.setIE(i);
        }
        (values.telefones || []).forEach((tel) => {
          const f = new Telefone();
          f.setDdd(tel.ddd);
          f.setNumero(tel.numero);
          pj.addTelefone(f);
        });
        pessoa = pj;
      }

      const dao = tipo === "PF" ? pfDAO : pjDAO;

      if (editando) {
        dao.atualizar(id, pessoa);
        message.success("Registro atualizado com sucesso!", 3);
        navigate("/listar");
      } else {
        dao.salvar(pessoa);
        form.resetFields();
        Modal.success({
          title: "Cadastro realizado com sucesso!",
          content: `O registro de ${
            values.tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"
          } foi salvo com êxito.`,
          okText: "OK",
          onOk: () => navigate("/listar"),
        });
      }
    } catch (erro) {
      console.error("❌ Erro ao salvar:", erro);
      message.error("Erro ao salvar registro: " + erro.message);
    }
  }

  // chave para “refrescar” o TelefoneList quando editar
  const telefonesKey = (form.getFieldValue("telefones") || []).length;

  return (
    <div
      id="scrollContainer"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        height: "calc(100vh - 100px)",
        padding: "16px 12px 32px 12px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {editando
            ? `Editar ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`
            : `Cadastro de ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`}
        </h2>

        <Form layout="vertical" form={form} onFinish={onFinish} scrollToFirstError>
          {/* 1) Tipo */}
          <Form.Item label="Tipo de Pessoa" name="tipo" initialValue="PF">
            <Radio.Group onChange={onChangeTipo}>
              <Radio value="PF">Pessoa Física</Radio>
              <Radio value="PJ">Pessoa Jurídica</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 2) Nome */}
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Informe o nome!" }]}
          >
            <Input placeholder="Nome completo ou razão social" />
          </Form.Item>

          {/* 3) E-mail */}
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

          {/* 4) Endereço (CEP auto via ViaCEP dentro do próprio componente) */}
          <EnderecoFormEX />

          {/* 5) Telefones */}
          <TelefoneListOO form={form} key={telefonesKey} />

          {/* 6) Campos específicos (CPF no PFForm, CNPJ no PJForm) */}
          {tipo === "PF" ? <PFForm /> : <PJForm />}

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? "Salvar Alterações" : "Salvar"}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate("/listar")}>
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}

export default PessoaFormOO;
