//
//  ImageGridView.swift
//  GiffyBoard
//
//  Created by Hachi on 2023-02-18.
//

import SwiftUI

struct ImageGridView: View {
    let images: [URL]
    let selectedCollectionId: Int?
    let fetchImages: (CollectionDTO) -> Void

    @State private var copiedImageURL: URL?
    @State private var isImageCopied = false

    var body: some View {
        ScrollView {
            LazyVGrid(columns: Array(repeating: GridItem(), count: 3)) {
                ForEach(images, id: \.self) { imageURL in
                    Button(action: {
                        copyImage(imageURL)
                    }) {
                        RemoteGiffy(url: imageURL)
                            .aspectRatio(contentMode: .fit)
                            .padding(4)
                            .overlay(isImageCopied && copiedImageURL == imageURL ? copiedOverlay : nil)
                    }
                }
            }
        }
    }

    private func copyImage(_ url: URL) {
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Error loading image: \(String(describing: error))")
                return
            }
            if let image = UIImage(data: data) {
                DispatchQueue.main.async {
                    let pasteboard = UIPasteboard.general
                    pasteboard.image = image
                    copiedImageURL = url
                    isImageCopied = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                        isImageCopied = false
                        copiedImageURL = nil
                    }
                }
            }
        }.resume()
    }

    private var copiedOverlay: some View {
        VStack {
            Image(systemName: "checkmark")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundColor(.white)
                .padding()
                .background(Color.black.opacity(0.8))
                .cornerRadius(8)
            Text("Copied")
                .foregroundColor(.white)
        }
        .padding(4)
        .background(Color.black.opacity(0.8))
        .cornerRadius(8)
        .transition(.opacity)
    }
}
