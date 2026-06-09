package audio

import (
	"log"
	"os"
	"sync"
	"time"

	"github.com/aridevk/tinyren/internal/constants"
	"github.com/gopxl/beep"
	"github.com/gopxl/beep/mp3"
	"github.com/gopxl/beep/speaker"
)

var speakerOnce sync.Once
var speakerErr error

func initSpeaker(format beep.Format) error {
	speakerOnce.Do(func() {
		speakerErr = speaker.Init(
			format.SampleRate,
			format.SampleRate.N(time.Second/10),
		)
	})

	return speakerErr
}

func Play(source string) {
	path := constants.PATH + source
	log.Println("Playing audio:", path)

	f, err := os.Open(path)
	if err != nil {
		log.Println("open:", err)
		return
	}

	streamer, format, err := mp3.Decode(f)
	if err != nil {
		_ = f.Close()
		log.Println("decode:", err)
		return
	}

	if err := initSpeaker(format); err != nil {
		_ = streamer.Close()
		_ = f.Close()
		log.Println("speaker init:", err)
		return
	}

	speaker.Play(beep.Seq(
		streamer,
		beep.Callback(func() {
			_ = streamer.Close()
			_ = f.Close()
		}),
	))
}
