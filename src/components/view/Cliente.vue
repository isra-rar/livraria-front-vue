<template>
  <div class="client-admin">
    <PageTitle icon="fa fa-users" main="Cliente" />
    <b-form>
      <input type="hidden" id="user-id" v-model="cliente.id" />
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Nome:" label-for="cliente-nome">
            <b-form-input
              id="nome"
              type="text"
              v-model="cliente.nome"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o nome"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="CPF:" label-for="cliente-cpf">
            <b-form-input
              id="cpf"
              type="text"
              v-model="cliente.cpf"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o CPF"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="E-mail:" label-for="cliente-email">
            <b-form-input
              id="email"
              type="text"
              v-model="cliente.email"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o e-mail"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Gênero" label-for="genero">
            <b-form-select v-model="cliente.sexo" :options="generos">
              <option :value="null" disabled>Selecione o seu Gênero</option>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="CEP:" label-for="cliente-cep">
            <b-form-input
              id="cliente-cep"
              type="text"
              v-model="cliente.enderecos[0].cep"
              @blur.native="buscaCep"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o CEP"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Logradouro:" label-for="cliente-logradouro">
            <b-form-input
              id="cliente-logradouro"
              type="text"
              v-model="cliente.enderecos[0].logradouro"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Logradouro"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" sm="12">
          <b-form-group label="Bairro:" label-for="cliente-bairro">
            <b-form-input
              id="cliente-bairro"
              type="text"
              v-model="cliente.enderecos[0].bairro"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Bairro"
            />
          </b-form-group>
        </b-col>
        <b-col md="6" sm="12">
          <b-form-group label="Numero:" label-for="cliente-numero">
            <b-form-input
              id="cliente-numero"
              type="text"
              v-model="cliente.enderecos[0].numero"
              required
              :readonly="mode === 'remove'"
              placeholder="Informe o Numero"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col xs="12">
          <b-button variant="success" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <hr />
    <div>
      <Table
        :items="clientes"
        :fields="fields"
        :current-page="pagina"
        :perPage="qtnpagina"
        :loadData="laodCliente"
      />
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle.vue";
import { showError, baseApiUrl } from "@/global";
import axios from "axios";
import Table from "../template/Table";
import { getCep } from "../../services/cepApi";

export default {
  name: "Cliente",
  components: { Table, PageTitle },
  data() {
    return {
      pagina: 1,
      qtnpagina: 3,
      mode: "save",
      cliente: {
        sexo: null,
        enderecos: [
          {
            logradouro: "",
            bairro: "",
            cep: "",
            numero: "",
          },
        ],
      },
      clientes: [],
      generos: [
        { value: "MASCULINO", text: "MASCULINO" },
        { value: "FEMININO", text: "FEMININO" },
      ],
      fields: [
        {
          key: "id",
          label: "Código",
          sortable: true,
        },
        {
          key: "nome",
          label: "Nome",
          sortable: true,
        },
        {
          key: "cpf",
          label: "CPF",
          sortable: true,
        },
        {
          key: "actions",
          label: "Ações",
        },
      ],
    };
  },
  methods: {
    loadData() {
      const url = `${baseApiUrl}/clientes`;
      axios.get(url).then((res) => {
        this.clientes = res.data.content;
      });
    },
    reset() {
      (this.mode = "save"),
        (this.cliente = { sexo: null, enderecos: [{}] }),
        this.loadData();
    },
    save() {
      const method = this.cliente.id ? "put" : "post";
      const id = this.cliente.id ? `/${this.cliente.id}` : "";
      axios[method](`${baseApiUrl}/clientes${id}`, this.cliente)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    async buscaCep() {
      const response = await getCep(this.cliente.enderecos[0].cep);

      if (!response) {
        return;
      }

      const { street, neighborhood } = response;
      this.cliente.enderecos[0].logradouro = street;
      this.cliente.enderecos[0].bairro = neighborhood;
    },
    remove() {
      const id = this.cliente.id;
      axios.delete(`${baseApiUrl}/clientes/${id}`).then(() => {
        this.$toasted.global.defaultSuccess();
        this.reset();
      });
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    },
    laodCliente(cliente, mode = "save") {
      this.mode = mode;
      this.cliente = { ...cliente };
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style>
</style>