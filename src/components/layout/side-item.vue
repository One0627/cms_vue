 <template>
  <el-submenu :index="node.path" :key="node.path" :title="node.meta.title" v-if="!node.hidden&&node.children ">
    <template slot="title">
      <i :class="node.meta.icon" />
      <span slot="title">{{node.meta.title}}</span>
    </template>
    <el-menu-item-group>
      <sideItem :node="cnode" :key="cnode.path" v-for="cnode in node.children" />
    </el-menu-item-group>
  </el-submenu>
  <el-menu-item :index="node.path" :key="node.path" :title="node.meta.title" v-else-if="!node.hidden" @click="jump(node.meta.title,node.path)">
    <i :class="node.meta.icon" />
    <span slot="title">{{node.meta.title}}</span>
  </el-menu-item>
</template>
<script>
import utils from '@/utils/utils'
export default {
  name: 'sideItem',
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  methods: {
    jump (title, path) {
      utils.$emit('jump', title, path)
    }
  }
}
</script>
