import type Sound from '../utilities/Sound'
import Rand from '../utilities/Rand'
import NotificationTypeOption from './NotificationTypeOption'
import type NotificationOption from '~/modules/notifications/NotificationOption'
import { useNotificationStore } from '~/stores/notification'

export default class Notifier {
  public static notify({
    message,
    type = NotificationTypeOption.primary,
    title = '',
    timeout = 3000,
    time = 'just now',
    sound = undefined,
    setting = undefined,
    image = undefined,
    strippedMessage = undefined,
  }: NotificationOption): void {
    window.onload = () => {
      // If we have sounds enabled for this, play it now
      if (sound)
        sound.play()

      if (setting && setting.desktopNotification.value && Notification.permission === 'granted') {
        const tempEl = document.createElement('div')
        tempEl.innerHTML = strippedMessage ?? message.replace(/<br\s*[/]?>/gi, '\n')
        const msg = tempEl.innerText.replace(/  +/g, ' ')
        const desktopNotification = new Notification(title, {
          body: msg,
          icon: image,
          silent: true,
        })
        setTimeout(() => {
          desktopNotification.close()
        }, timeout)
      }

      // Check if this type of notification is disabled
      if (setting && setting.inGameNotification && !setting.inGameNotification.value)
        return

      // Get the notification ready to display
      useNotificationStore().addNotification({
        message,
        type,
        title,
        timeout,
        time,
        sound,
        setting,
        image,
        strippedMessage,
      })
    }
  }

  public static prompt({
    title,
    message,
    type = NotificationTypeOption.primary,
    timeout = 0,
    sound = null,
  }: {
    title: string
    message: string
    type?: NotificationTypeOption
    timeout?: number
    sound?: Sound
  }): Promise<string> {
    // If we have sounds enabled for this, play it now
    if (sound)
      sound.play()

    return new Promise((resolve) => {
      // Get the notification ready to display
      const modalID = Rand.string(7)
      const html = `
<div class="modal fade noselect" id="modal${modalID}" tabindex="-1" role="dialog" aria-badgeledby="prompt">
    <div class="modal-dialog modal-dialog-scrollable modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header modal-header pb-0 pt-2 px-2 bg-${NotificationTypeOption[type]}">
                <h5>${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body py-2 px-2 text-left">
                ${message.replace(/\n/g, '<br/>')}
                <br/>
                <br/>
                <input class="outline-dark form-control" placeholder="Type here.." id="promptInput${modalID}" type="text">
            </div>
            <div class="modal-footer p-2">
                <button class="btn btn-block outline-dark btn-${NotificationTypeOption[type]}" data-dismiss="modal">Submit</button>
            </div>
        </div>
    </div>
</div>`
      $('#toaster').before(html);

      (document.getElementById(`promptInput${modalID}`) as HTMLInputElement).addEventListener('keyup', ({ key }) => {
        if (key === 'Enter')
          $(`#modal${modalID}`).modal('hide')
      })

      $(`#modal${modalID}`).modal({
        backdrop: 'static',
        show: true,
      })

      // Once the modal is shown, hide it after specified timeout
      $(`#modal${modalID}`).on('shown.bs.modal', () => {
        (document.getElementById(`promptInput${modalID}`) as HTMLInputElement).focus()
        if (timeout > 0) {
          setTimeout(() => {
            $(`#modal${modalID}`).modal('hide')
          }, timeout)
        }
      })

      // Once hidden remove the element
      $(`#modal${modalID}`).on('hidden.bs.modal', () => {
        const inputEl = document.getElementById(`promptInput${modalID}`) as HTMLInputElement
        const inputValue = inputEl?.value
        document.getElementById(`modal${modalID}`).remove()
        resolve(inputValue)
      })
    })
  }

  public static confirm({
    title,
    message,
    confirm = 'ok',
    cancel = 'cancel',
    type = NotificationTypeOption.primary,
    timeout = 0,
    sound = null,
  }: {
    title: string
    message: string
    confirm?: string
    cancel?: string
    type?: NotificationTypeOption
    timeout?: number
    sound?: Sound
  }): Promise<boolean> {
    // If we have sounds enabled for this, play it now
    if (sound)
      sound.play()

    return new Promise((resolve) => {
      // Get the notification ready to display
      const modalID = Rand.string(7)
      const html = `
<div class="modal fade noselect" id="modal${modalID}" tabindex="-1" role="dialog" aria-badgeledby="prompt">
    <div class="modal-dialog modal-dialog-scrollable modal-sm" role="document">
        <div class="modal-content">
            <div class="modal-header modal-header pb-0 pt-2 px-2 bg-${NotificationTypeOption[type]}">
                <h5>${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body py-2 px-2 text-left">
                ${message.replace(/\n/g, '<br/>')}
            </div>
            <div class="modal-footer p-2">
                <button class="btn col outline-dark btn-${NotificationTypeOption[type]}" data-dismiss="modal" id="modalConfirm${modalID}">${confirm}</button>
                <button class="btn col outline-dark btn-secondary" data-dismiss="modal">${cancel}</button>
            </div>
        </div>
    </div>
</div>`
      $('#toaster').before(html);

      (document.getElementById(`modalConfirm${modalID}`) as HTMLInputElement).addEventListener('click', () => {
        resolve(true)
      })

      $(`#modal${modalID}`).modal({
        backdrop: 'static',
        show: true,
      })

      // Once the modal is shown, hide it after specified timeout
      $(`#modal${modalID}`).on('shown.bs.modal', () => {
        if (timeout > 0) {
          setTimeout(() => {
            $(`#modal${modalID}`).modal('hide')
          }, timeout)
        }
      })

      // Once hidden remove the element
      $(`#modal${modalID}`).on('hidden.bs.modal', () => {
        document.getElementById(`modal${modalID}`).remove()
        resolve(false)
      })
    })
  }
}
