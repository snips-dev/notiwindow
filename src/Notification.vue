<script>
import { TransitionGroup, h } from 'vue'

export default {
  inject: {
    context: { default: { group: '', position: 'top' } },
  },
  props: {
    maxNotifications: {
      type: Number,
      default: 10,
    },
    enter: {
      type: String,
      default: ''
    },
    enterFrom: {
      type: String,
      default: ''
    },
    enterTo: {
      type: String,
      default: ''
    },
    leave: {
      type: String,
      default: ''
    },
    leaveFrom: {
      type: String,
      default: ''
    },
    leaveTo: {
      type: String,
      default: ''
    },
    move: {
      type: String,
      default: ''
    },
    moveDelay: {
      type: String,
      default: ''
    }
  },
  emits: ['close'],
  data() {
    return {
      notifications: [],
      timeouts: {},
    }
  },
  computed: {
    sortedNotifications() {
      if (this.context.position === 'bottom') {
        return [...this.notificationsByGroup]
          .slice(0, this.maxNotifications)
      }

      // if not bottom reverse the array
      return [...this.notificationsByGroup]
        .reverse()
        .slice(0, this.maxNotifications)
    },
    notificationsByGroup() {
      return this.notifications.filter((n) => n.group === this.context.group)
    },
  },
  mounted() {
    window.addEventListener('notify', this.add)
    window.addEventListener('close', this.remove)
  },
  methods: {
    add(evt) {
      const { notification, timeout } = evt.detail
      const DEFAULT_TIMEOUT = 3000

      this.notifications.push(notification)

      this.timeouts[notification.id] = setTimeout(() => {
        this.remove(notification.id)
      }, timeout || DEFAULT_TIMEOUT)
    },
    close(evt) {
      const id = evt.detail
      this.$emit('close')
      this.remove(id)
    },
    remove(id) {
      this.notifications.splice(this.notifications.findIndex(n => n.id === id), 1)

      clearTimeout(this.timeouts[id])
    }
  },
  render() {
    return h(
      TransitionGroup,
      {
        'enter-active-class':
          this.notificationsByGroup.length > 1
            ? [this.enter, this.moveDelay].join(' ')
            : this.enter,
        'enter-from-class': this.enterFrom,
        'enter-to-class': this.enterTo,
        'leave-active-class': this.leave,
        'leave-from-class': this.leaveFrom,
        'leave-to-class': this.leaveTo,
        'move-class': this.move,
      },
      {
        default: () => {
          return this.$slots.default({
            notifications: this.sortedNotifications,
            close: this.close,
          })
        }
      }
    )
  },
}
</script>