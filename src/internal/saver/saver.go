package saver

import (
	"os"

	crypt "github.com/aridevk/tinyren/internal/encryption"
)

func CreateSaveFileIfNotExists(saveFilePath string, saveContent string) error {
	if _, err := os.Stat(saveFilePath); os.IsNotExist(err) {
		emptyFile, err := os.Create(saveFilePath)
		if err != nil {
			return err
		}
		defer emptyFile.Close()
		err = Save(emptyFile, saveContent)
		if err != nil {
			return err
		}
	}
	return nil
}

func Save(writer *os.File, saveContent string) error {
	var encryptedContent, err = crypt.Encrypt(saveContent)
	if err != nil {
		return err
	}

	_, err = writer.WriteString(encryptedContent)
	if err != nil {
		return err
	}
	return nil
}

func Load(saveFilePath string) (string, error) {
	if saveFilePath == "" {
		return "", nil
	}

	if file, err := os.Stat(saveFilePath); err != nil {
		return "", nil
	} else if file.IsDir() {
		return "", nil
	} else if file.Name() != "_vs.dat" {
		return "", nil
	} else {
	}

	// read file content
	data, err := os.ReadFile(saveFilePath)
	if err != nil {
		return "", err
	}

	if len(data) == 0 {
		return "", nil
	}

	decryptedContent, err := crypt.Decrypt(string(data))
	if err != nil {
		return "", err
	}

	return decryptedContent, nil
}
