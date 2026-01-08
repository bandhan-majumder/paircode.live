// more info: https://stackoverflow.com/a/75734789/17825147

const peerConfiguration = {
    iceServers:[
        {
            urls:[
              'stun:stun.l.google.com:19302',
              'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

export default peerConfiguration