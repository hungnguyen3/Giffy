//
//  RemoteGiffy.swift
//  GiffyBoard
//
//  Created by Hachi on 2023-02-18.
//

import SwiftUI

struct RemoteGiffy: View {
    let url: URL
    
    @State private var image: UIImage?
    
    var body: some View {
        if let image = image {
            Image(uiImage: image)
                .resizable()
                .aspectRatio(contentMode: .fit)
        } else {
            Color.gray
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .onAppear(perform: loadImage)
        }
    }
    
    private func loadImage() {
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data, error == nil else {
                print("Error loading image: \(String(describing: error))")
                return
            }
            DispatchQueue.main.async {
                self.image = UIImage(data: data)
            }
        }.resume()
    }
}
